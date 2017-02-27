export default class LocalStorage {
  static isAvailable() {
    const test = 'isAvailable';

    try {
      localStorage.setItem('test', test);
      localStorage.removeItem('test');

      return true;
    } catch (err) {
      return false;
    }
  }
}
