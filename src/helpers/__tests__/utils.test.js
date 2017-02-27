import * as Utils from 'helpers/utils';

describe('Utils', () => {
  describe('ucfirst', () => {
    it('should capitalize only first word', () => {
      const sample = 'hello world';

      expect(Utils.ucfirst(sample)).toBe('Hello world');
    });
  });

  describe('ucwords', () => {
    it('should capitalize every word', () => {
      const sample = 'hello world';

      expect(Utils.ucwords(sample)).toBe('Hello World');
    });
  });

  describe('stripTags', () => {
    const sample = '<div>hello <strong>world</strong></div>';

    expect(Utils.stripTags(sample)).toBe('hello world');
  });

  describe('sanitizeName', () => {
    it('should print pretty sanitized name', () => {
      const sample = 'hello-world';

      expect(Utils.sanitizeName(sample)).toBe('Hello World');
    });
  });
});
