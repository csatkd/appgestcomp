import { useState, useEffect } from 'react';

const DB_NAME = 'dojang-db';
const DB_VERSION = 1;

export interface CachedData<T = any> {
  key: string;
  data: T;
  timestamp: number;
  ttl?: number; // Time to live in milliseconds
}

export function useIndexedDB() {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Failed to open IndexedDB');
    };

    request.onsuccess = () => {
      setDb(request.result);
      setIsReady(true);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      if (!database.objectStoreNames.contains('cache')) {
        const store = database.createObjectStore('cache', { keyPath: 'key' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  }, []);

  const setItem = async <T>(key: string, data: T, ttl?: number): Promise<void> => {
    if (!db) return;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');

      const item: CachedData<T> = {
        key,
        data,
        timestamp: Date.now(),
        ttl,
      };

      const request = store.put(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  const getItem = async <T>(key: string): Promise<T | null> => {
    if (!db) return null;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      const request = store.get(key);

      request.onsuccess = () => {
        const item = request.result as CachedData<T> | undefined;

        if (!item) {
          resolve(null);
          return;
        }

        // Check if data has expired
        if (item.ttl && Date.now() - item.timestamp > item.ttl) {
          // Delete expired data
          deleteItem(key);
          resolve(null);
          return;
        }

        resolve(item.data);
      };

      request.onerror = () => reject(request.error);
    });
  };

  const deleteItem = async (key: string): Promise<void> => {
    if (!db) return;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  const clear = async (): Promise<void> => {
    if (!db) return;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  const getAll = async <T>(): Promise<CachedData<T>[]> => {
    if (!db) return [];

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const cleanExpired = async (): Promise<void> => {
    const items = await getAll();
    const now = Date.now();

    for (const item of items) {
      if (item.ttl && now - item.timestamp > item.ttl) {
        await deleteItem(item.key);
      }
    }
  };

  return {
    isReady,
    setItem,
    getItem,
    deleteItem,
    clear,
    getAll,
    cleanExpired,
  };
}
