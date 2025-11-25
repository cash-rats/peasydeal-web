import type { ShoppingCart } from '~/sessions/types';

const DB_NAME = 'peasydeal_cart';
const DB_VERSION = 1;
const STORE_NAME = 'cart';
const CART_KEY = 'default-cart';

const getIndexedDB = (): IDBFactory | null => {
  if (typeof indexedDB !== 'undefined') {
    return indexedDB;
  }

  if (typeof window !== 'undefined' && 'indexedDB' in window) {
    return window.indexedDB;
  }

  return null;
};

const openCartDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const idb = getIndexedDB();
    if (!idb) {
      reject(new Error('IndexedDB not available'));
      return;
    }

    const request = idb.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error ?? new Error('Failed to open IndexedDB'));
    };
  });
};

export const isCartStorageAvailable = (): boolean => {
  return getIndexedDB() !== null;
};

export const loadCart = async (): Promise<ShoppingCart> => {
  let db: IDBDatabase | null = null;

  try {
    db = await openCartDb();

    const result = await new Promise<ShoppingCart>((resolve, reject) => {
      const tx = db!.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(CART_KEY);

      let cartData: ShoppingCart | undefined;

      request.onsuccess = () => {
        cartData = request.result as ShoppingCart | undefined;
      };

      tx.oncomplete = () => {
        resolve(cartData ?? {});
      };

      tx.onerror = () => {
        reject(tx.error ?? new Error('Failed to load cart from IndexedDB'));
      };

      tx.onabort = () => {
        reject(new Error('Transaction aborted while loading cart from IndexedDB'));
      };
    });

    // Basic validation: ensure the result is an object
    if (result && typeof result === 'object' && !Array.isArray(result)) {
      return result;
    }

    return {};
  } catch (error) {
    console.error('loadCart from IndexedDB failed', error);
    return {};
  } finally {
    if (db) {
      db.close();
    }
  }
};

export const saveCart = async (cart: ShoppingCart): Promise<void> => {
  let db: IDBDatabase | null = null;

  try {
    db = await openCartDb();

    await new Promise<void>((resolve, reject) => {
      const tx = db!.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(cart, CART_KEY);

      tx.oncomplete = () => {
        resolve();
      };

      tx.onerror = () => {
        reject(tx.error ?? new Error('Failed to save cart to IndexedDB'));
      };

      tx.onabort = () => {
        reject(new Error('Transaction aborted while saving cart to IndexedDB'));
      };
    });
  } catch (error) {
    console.error('saveCart to IndexedDB failed', error);
    throw error;
  } finally {
    if (db) {
      db.close();
    }
  }
};

export const clearCart = async (): Promise<void> => {
  let db: IDBDatabase | null = null;

  try {
    db = await openCartDb();

    await new Promise<void>((resolve, reject) => {
      const tx = db!.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(CART_KEY);

      tx.oncomplete = () => {
        resolve();
      };

      tx.onerror = () => {
        reject(tx.error ?? new Error('Failed to clear cart in IndexedDB'));
      };

      tx.onabort = () => {
        reject(new Error('Transaction aborted while clearing cart in IndexedDB'));
      };
    });
  } catch (error) {
    console.error('clearCart in IndexedDB failed', error);
    throw error;
  } finally {
    if (db) {
      db.close();
    }
  }
};

