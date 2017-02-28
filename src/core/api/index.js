import axios from 'axios';

import Cache from 'core/cache';
import Endpoint from 'models/endpoint';
import httpCodes from 'helpers/http-codes';
import localStorage from 'helpers/local-storage';
import Toast from 'helpers/toast';

const registerEndpoints = require.context('./endpoints', true, /\.js$/);

class API {
  constructor(endpoints) {
    this.API_URL = process.env.API_URL;
    this.API_REQUEST_MAX_RETRY_COUNT = Number(process.env.API_REQUEST_MAX_RETRY_COUNT);
    this.API_REQUEST_TIMEOUT = Number(process.env.API_REQUEST_TIMEOUT);

    // Endpoints will be registered here as ($.group.name)
    this.$ = {};

    this.requester = axios.create({
      baseURL: this.API_URL,
      timeout: this.API_REQUEST_TIMEOUT,
    });
    this.requester.interceptors.request.use(this.requestInterceptor.bind(this));
    this.requester.interceptors.response.use(
      this.responseInterceptor.bind(this),
      this.responseErrorInterceptor.bind(this),
    );

    this.shouldCacheRequests = localStorage.isAvailable();

    this.registerEndpoints(endpoints);
  }

  /**
   * @return {Object}
   */
  requestInterceptor(requestConfig) {
    if (!this.shouldCacheRequests) {
      return requestConfig;
    }

    const cachedResource = Cache.get(Cache.createHash(requestConfig));

    if (cachedResource) {
      requestConfig.adapter = (config) => {
        config.isCached = true;

        return new Promise(resolve => resolve({
          data: cachedResource,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }));
      };
    }

    return requestConfig;
  }

  /**
   * @return {Promise}
   */
  responseInterceptor(response) {
    if (!this.shouldCacheRequests) {
      return response;
    }

    if (!response.config.isCached && response.config.localStorageCache) {
      try {
        Cache.put(
          Cache.createHash(response.config),
          response.data,
        );
      } catch (err) {
        Toast._('Something went wrong.', err);
      }
    }

    return response;
  }

  /**
   * @return {Promise}
   */
  responseErrorInterceptor(error) {
    if (!error.config || !error.response) throw error;

    const status = error.response.status;

    const config = Object.assign({ retryCount: 0 }, error.config);
    const isInternalServerError = (
      status >= httpCodes.INTERNAL_SERVER_ERROR
      &&
      status < httpCodes.MAX_SERVER_ERROR
    );

    if (!isInternalServerError) throw error;
    if (config.retryCount >= this.API_REQUEST_MAX_RETRY_COUNT) throw error;

    config.retryCount += 1;

    return this.requester.request(config);
  }

  getRequester() {
    return this.requester;
  }

  get(url, options) {
    return this.requester.get(
      `${this.API_URL}${url}`,
      {
        localStorageCache: this.shouldCacheRequests,
        ...options,
      },
    );
  }

  /**
   * @param {Endpoint} instance
   */
  addEndpoint(instance) {
    if (!(instance instanceof Endpoint)) throw new TypeError('addEndpoint expects an Endpoint as parameter.');

    const groupName = instance.getGroup();
    const endpointName = instance.getName();

    if (!this.$[groupName]) this.$[groupName] = {};

    if (this.$[groupName][endpointName]) throw new Error(`Endpoint ${groupName}.${endpointName} already defined.`);

    this.$[groupName][endpointName] = instance.call.bind(this);
  }

  /**
   * @param {Array[]} filesPath
   */
  registerEndpoints(filesPath) {
    filesPath.keys().map(path => this.addEndpoint(registerEndpoints(path).default));
  }
}

export default new API(registerEndpoints);
