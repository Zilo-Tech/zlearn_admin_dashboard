// src/utils/storage.ts

export const storage = {
  // Get item from localStorage
  get: (key: string): any => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return null;
    }
  },

  // Set item in localStorage
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
    }
  },

  // Remove item from localStorage
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  },

  // Clear all localStorage
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

// Token management helpers
export const tokenStorage = {
  getAccessToken: (): string | null => {
    return storage.get('admin_access_token');
  },

  setAccessToken: (token: string): void => {
    storage.set('admin_access_token', token);
  },

  getRefreshToken: (): string | null => {
    return storage.get('admin_refresh_token');
  },

  setRefreshToken: (token: string): void => {
    storage.set('admin_refresh_token', token);
  },

  clearTokens: (): void => {
    storage.remove('admin_access_token');
    storage.remove('admin_refresh_token');
  },
};

// User data helpers
export const userStorage = {
  getUser: (): any => {
    return storage.get('admin_user');
  },

  setUser: (user: any): void => {
    storage.set('admin_user', user);
  },

  clearUser: (): void => {
    storage.remove('admin_user');
  },
};