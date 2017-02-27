import Vue from 'vue';
import 'babel-polyfill';

import App from './components/app';

import './styles/vendor.scss';
import './styles/master.scss';

const app = new Vue({
  el: '#app',
  render: h => h(App),
});

export default app;
