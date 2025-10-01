export interface FormStorageOptions {
  key: string;
  expirationHours?: number;
  maxSize?: number;
}

interface StoredFormData {
  data: any;
  timestamp: number;
  version: string;
}

const STORAGE_PREFIX = 'invoice_form_';
const DEFAULT_EXPIRATION_HOURS = 24;
const DEFAULT_MAX_SIZE = 1024 * 1024; // 1MB
const CURRENT_VERSION = '1.0';

export class FormStorage {
  private key: string;
  private expirationMs: number;
  private maxSize: number;

  constructor(options: FormStorageOptions) {
    this.key = STORAGE_PREFIX + options.key;
    this.expirationMs = (options.expirationHours || DEFAULT_EXPIRATION_HOURS) * 60 * 60 * 1000;
    this.maxSize = options.maxSize || DEFAULT_MAX_SIZE;
  }

  /**
   * Save form data to localStorage with timestamp and version
   */
  save(data: any): boolean {
    try {
      if (!this.isLocalStorageAvailable()) {
        console.warn('localStorage not available');
        return false;
      }

      const serializedData = this.serialize(data);
      
      // Check size limit
      if (serializedData.length > this.maxSize) {
        console.warn('Form data too large for localStorage');
        return false;
      }

      const storedData: StoredFormData = {
        data: serializedData,
        timestamp: Date.now(),
        version: CURRENT_VERSION
      };

      localStorage.setItem(this.key, JSON.stringify(storedData));
      return true;
    } catch (error) {
      console.error('Failed to save form data:', error);
      return false;
    }
  }

  /**
   * Load form data from localStorage with validation
   */
  load(): any | null {
    try {
      if (!this.isLocalStorageAvailable()) {
        return null;
      }

      const storedDataStr = localStorage.getItem(this.key);
      if (!storedDataStr) {
        return null;
      }

      const storedData: StoredFormData = JSON.parse(storedDataStr);

      // Check expiration
      if (Date.now() - storedData.timestamp > this.expirationMs) {
        this.clear();
        return null;
      }

      // Version check (for future compatibility)
      if (storedData.version !== CURRENT_VERSION) {
        console.warn('Stored form data version mismatch, clearing');
        this.clear();
        return null;
      }

      return this.deserialize(storedData.data);
    } catch (error) {
      console.error('Failed to load form data:', error);
      this.clear(); // Clear corrupted data
      return null;
    }
  }

  /**
   * Clear stored form data
   */
  clear(): void {
    try {
      if (this.isLocalStorageAvailable()) {
        localStorage.removeItem(this.key);
      }
    } catch (error) {
      console.error('Failed to clear form data:', error);
    }
  }

  /**
   * Check if data exists and is not expired
   */
  exists(): boolean {
    try {
      if (!this.isLocalStorageAvailable()) {
        return false;
      }

      const storedDataStr = localStorage.getItem(this.key);
      if (!storedDataStr) {
        return false;
      }

      const storedData: StoredFormData = JSON.parse(storedDataStr);
      return Date.now() - storedData.timestamp <= this.expirationMs;
    } catch {
      return false;
    }
  }

  /**
   * Serialize data to JSON string
   */
  private serialize(data: any): string {
    return JSON.stringify(data);
  }

  /**
   * Deserialize JSON string to data
   */
  private deserialize(dataStr: string): any {
    return JSON.parse(dataStr);
  }

  /**
   * Check if localStorage is available
   */
  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get storage usage information
   */
  getStorageInfo(): { used: number; available: boolean; exists: boolean } {
    return {
      used: this.getStorageSize(),
      available: this.isLocalStorageAvailable(),
      exists: this.exists()
    };
  }

  /**
   * Get approximate size of stored data in bytes
   */
  private getStorageSize(): number {
    try {
      const data = localStorage.getItem(this.key);
      return data ? data.length : 0;
    } catch {
      return 0;
    }
  }
}

/**
 * Clean up expired form data from localStorage
 */
export function cleanupExpiredFormData(): void {
  try {
    if (!localStorage) return;

    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        try {
          const storedDataStr = localStorage.getItem(key);
          if (storedDataStr) {
            const storedData: StoredFormData = JSON.parse(storedDataStr);
            const age = Date.now() - storedData.timestamp;
            
            if (age > DEFAULT_EXPIRATION_HOURS * 60 * 60 * 1000) {
              keysToRemove.push(key);
            }
          }
        } catch {
          // If we can't parse it, mark for removal
          keysToRemove.push(key);
        }
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    if (keysToRemove.length > 0) {
      console.log(`Cleaned up ${keysToRemove.length} expired form data entries`);
    }
  } catch (error) {
    console.error('Failed to cleanup expired form data:', error);
  }
}