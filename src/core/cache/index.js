import md5 from 'md5';

/**
 * Cache duration in milliseconds
 */
const CACHE_DURATION_TIME = 1000 * Number(process.env.API_REQUEST_CACHE_DURATION_TIME);
/**
 * Key where resources will be saved
 */
const CACHE_IDENTIFIER_KEY = 'cachedResources';

export default class Cache {
  /**
   * @param {Object} config
   * @return {String}
   */
  static createHash(config) {
    return md5(config.url + JSON.stringify(config.params));
  }

  /**
   * @return {Boolean}
   */
  static createCachedResources() {
    return window.localStorage.setItem(
      CACHE_IDENTIFIER_KEY,
      {},
    );
  }

  static checkForExpiredCachedResources() {
    Object.entries(Cache.getCachedResources(false)).forEach(([hash, resource]) => {
      if (!resource.timestamp || Date.now() >= resource.timestamp + CACHE_DURATION_TIME) {
        Cache.delete(hash);
      }
    });
  }

  /**
   * @param {Boolean=} checkExpired - check for expired resources
   * @return {Object} if available
   * @return {null} if not available
   */
  static getCachedResources(checkExpired = true) {
    const getCachedResources = () => window.localStorage.getItem(CACHE_IDENTIFIER_KEY);

    if (!getCachedResources()) {
      window.localStorage.setItem(
        CACHE_IDENTIFIER_KEY,
        JSON.stringify({}),
      );
    } else if (checkExpired) {
      Cache.checkForExpiredCachedResources();
    }

    return JSON.parse(getCachedResources());
  }

  /**
   * @param {String} hash
   * @return {Object} if available
   * @return {undefined} if not available
   */
  static get(hash) {
    const cachedResource = Cache.getCachedResources()[hash];

    if (!cachedResource) return undefined;

    return Cache.getCachedResources()[hash].data;
  }

  /**
   * @param {String} hash
   * @param {Object} data
   * @return {Boolean}
   */
  static put(hash, data) {
    return window.localStorage.setItem(
      CACHE_IDENTIFIER_KEY,
      JSON.stringify({
        ...Cache.getCachedResources(),
        [hash]: {
          data,
          timestamp: Date.now(),
        },
      }),
    );
  }

  /**
   * @param {String} hash
   * @return {Boolean}
   */
  static delete(hash) {
    const cachedResources = Cache.getCachedResources(false);

    Reflect.deleteProperty(cachedResources, hash);

    return window.localStorage.setItem(
      CACHE_IDENTIFIER_KEY,
      JSON.stringify(cachedResources),
    );
  }
}
