export default class LocalStorage {
  static isAvailable() {
    const test = 'isAvailable';

    try {
      window.localStorage.setItem('test', test);
      window.localStorage.removeItem('test');

      return true;
    } catch (err) {
      return false;
    }
  }
}
