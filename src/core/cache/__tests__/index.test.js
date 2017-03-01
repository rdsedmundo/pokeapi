import
Cache,
{
  CACHE_DURATION_TIME,
  CACHE_IDENTIFIER_KEY,
} from 'core/cache';
import md5 from 'md5';

describe('Cache', () => {
  beforeEach(() => {
    window.localStorage = {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
    };
  });

  describe('when create hash', () => {
    it('should parse an valid hash using md5', () => {
      const config = {
        url: 123,
        params: 456,
      };

      expect(Cache.createHash(config)).toBe(md5(config.url + JSON.stringify(config.params)));
    });
  });

  describe('when create resource', () => {
    it('should add CACHE_IDENTIFIER_KEY to the localStorage', () => {
      Cache.createCachedResources();

      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        CACHE_IDENTIFIER_KEY,
        JSON.stringify({}),
      );
    });
  });

  describe('when getting cached resources', () => {
    it('should create cached resources, if not present', () => {
      window.localStorage.getItem
        .mockReturnValueOnce(null)
        .mockReturnValueOnce(JSON.stringify({}));

      Cache.getCachedResources();

      expect(window.localStorage.setItem).toHaveBeenCalled();
    });

    it('should only expire resource if timestamp is old', () => {
      window.localStorage.getItem
        .mockReturnValue(JSON.stringify({
          olderHash: {
            data: {},
            timestamp: 0,
          },
          testHash: {
            data: {},
            timestamp: Date.now(),
          },
        }));

      const oldDelete = Cache.delete;

      Cache.delete = jest.fn();
      Cache.getCachedResources();

      expect(Cache.delete).toHaveBeenCalledWith('olderHash');
      expect(Cache.delete).not.toHaveBeenCalledWith('testHash');

      Cache.delete = oldDelete;
    });

    it('should return an cached resource passed by it\'s hash', () => {
      window.localStorage.getItem
        .mockReturnValue(JSON.stringify({
          testHash: {
            data: {},
            timestamp: Date.now(),
          },
        }));

      expect(Cache.get('testHash')).toEqual({});
    });

    it('should return an undefined cached resource, when passed unknown hash', () => {
      window.localStorage.getItem
        .mockReturnValue(JSON.stringify({}));

      expect(Cache.get('testHash')).toBeUndefined();
    });
  });

  describe('when saving resources', () => {
    it('should store resource, and save previous values', () => {
      const localData = {
        testHash: {
          data: {},
          timestamp: Date.now(),
        },
      };
      const newData = { environment: 'test' };

      window.localStorage.setItem
        .mockImplementation((hash, data) => {
          localData[hash] = JSON.stringify(data);
        });

      window.localStorage.getItem
        .mockImplementation(() => JSON.stringify(localData));

      Cache.put('anotherHash', newData);

      expect(Cache.getCachedResources()).toEqual(localData);
    });
  });
});
