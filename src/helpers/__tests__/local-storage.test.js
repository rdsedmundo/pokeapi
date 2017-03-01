import localStorage from 'helpers/local-storage';

describe('localStorage', () => {
  beforeEach(() => {
    window.localStorage = {
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
  });

  it('should return true if is available', () => {
    const isAvailable = localStorage.isAvailable();

    expect(isAvailable).toBeTruthy();
    expect(window.localStorage.setItem).toHaveBeenCalledWith('test', 'isAvailable');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('test');
  });

  it('should return false if it\'s not available', () => {
    window.localStorage.setItem
      .mockImplementation(() => {
        throw new Error();
      });

    const isAvailable = localStorage.isAvailable();

    expect(isAvailable).toBeFalsy();
  });
});
