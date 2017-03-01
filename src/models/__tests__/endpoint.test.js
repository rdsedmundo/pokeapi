import Endpoint from 'models/endpoint';

describe('Endpoint', () => {
  describe('when initialize', () => {
    it('should create an default endpoint', () => {
      const endpoint = new Endpoint();

      expect(endpoint.getGroup()).toBe('');
      expect(endpoint.getName()).toBe('');
      expect(endpoint.call()).toBe(endpoint);
    });
  });
});
