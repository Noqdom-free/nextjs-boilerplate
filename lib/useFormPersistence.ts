import { useEffect, useRef, useCallback } from 'react';
import { UseFormWatch, UseFormReset, FieldValues } from 'react-hook-form';
import { FormStorage } from './formStorage';
import { useDebounceCallback } from './hooks';

export interface UseFormPersistenceOptions {
  /**
   * Unique key to identify this form's data in localStorage
   */
  storageKey: string;
  
  /**
   * How long to debounce save operations (milliseconds)
   * @default 1000
   */
  debounceMs?: number;
  
  /**
   * How long to keep data in localStorage (hours)
   * @default 24
   */
  expirationHours?: number;
  
  /**
   * Maximum size of data to store (bytes)
   * @default 1048576 (1MB)
   */
  maxSize?: number;
  
  /**
   * Fields to exclude from persistence
   */
  excludeFields?: string[];
  
  /**
   * Callback when data is successfully restored
   */
  onRestore?: (data: any) => void;
  
  /**
   * Callback when data is successfully saved
   */
  onSave?: (data: any) => void;
  
  /**
   * Callback when persistence fails
   */
  onError?: (error: string) => void;
}

export interface FormPersistenceReturn {
  /**
   * Manually save current form data
   */
  saveData: () => void;
  
  /**
   * Manually clear stored data
   */
  clearData: () => void;
  
  /**
   * Check if stored data exists
   */
  hasStoredData: () => boolean;
  
  /**
   * Get storage information
   */
  getStorageInfo: () => { used: number; available: boolean; exists: boolean };
}

/**
 * Custom hook for automatic form data persistence using localStorage
 */
export function useFormPersistence<T extends FieldValues>(
  watch: UseFormWatch<T>,
  reset: UseFormReset<T>,
  options: UseFormPersistenceOptions
): FormPersistenceReturn {
  const storageRef = useRef<FormStorage | null>(null);
  const isRestoringRef = useRef(false);
  const initializedRef = useRef(false);

  // Initialize storage
  if (!storageRef.current) {
    storageRef.current = new FormStorage({
      key: options.storageKey,
      expirationHours: options.expirationHours,
      maxSize: options.maxSize
    });
  }

  const storage = storageRef.current;

  /**
   * Filter out excluded fields from form data
   */
  const filterData = useCallback((data: T): Partial<T> => {
    if (!options.excludeFields || options.excludeFields.length === 0) {
      return data;
    }

    const filtered = { ...data };
    options.excludeFields.forEach(field => {
      delete (filtered as any)[field];
    });

    return filtered;
  }, [options.excludeFields]);

  /**
   * Save form data to localStorage
   */
  const saveFormData = useCallback((data: T) => {
    try {
      // Skip saving if we're currently restoring data
      if (isRestoringRef.current) {
        return;
      }

      const filteredData = filterData(data);
      const success = storage.save(filteredData);
      
      if (success) {
        options.onSave?.(filteredData);
      } else {
        options.onError?.('Failed to save form data to localStorage');
      }
    } catch (error) {
      options.onError?.(`Error saving form data: ${error}`);
    }
  }, [storage, filterData, options]);

  /**
   * Debounced save function
   */
  const debouncedSave = useDebounceCallback(
    saveFormData,
    options.debounceMs || 1000
  );

  /**
   * Restore form data from localStorage
   */
  const restoreFormData = useCallback(() => {
    try {
      const storedData = storage.load();
      
      if (storedData) {
        isRestoringRef.current = true;
        
        // Reset form with stored data
        reset(storedData);
        
        options.onRestore?.(storedData);
        
        // Reset the flag after a brief delay to allow form to settle
        setTimeout(() => {
          isRestoringRef.current = false;
        }, 100);
        
        return true;
      }
      
      return false;
    } catch (error) {
      options.onError?.(`Error restoring form data: ${error}`);
      return false;
    }
  }, [storage, reset, options]);

  /**
   * Manual save function
   */
  const saveData = useCallback(() => {
    const currentData = watch();
    saveFormData(currentData);
  }, [watch, saveFormData]);

  /**
   * Manual clear function
   */
  const clearData = useCallback(() => {
    storage.clear();
  }, [storage]);

  /**
   * Check if stored data exists
   */
  const hasStoredData = useCallback(() => {
    return storage.exists();
  }, [storage]);

  /**
   * Get storage information
   */
  const getStorageInfo = useCallback(() => {
    return storage.getStorageInfo();
  }, [storage]);

  /**
   * Initialize: restore data on first mount
   */
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      restoreFormData();
    }
  }, [restoreFormData]);

  /**
   * Auto-save: watch for form changes and save with debounce
   */
  useEffect(() => {
    const subscription = watch((data) => {
      // Only start auto-saving after initialization and not during restore
      if (initializedRef.current && !isRestoringRef.current) {
        debouncedSave(data as T);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, debouncedSave]);

  /**
   * Cleanup: save final data on unmount
   */
  useEffect(() => {
    return () => {
      // Save current state on unmount (page navigation/close)
      if (initializedRef.current && !isRestoringRef.current) {
        const currentData = watch();
        saveFormData(currentData);
      }
    };
  }, [watch, saveFormData]);

  /**
   * Handle page visibility change (save when tab becomes hidden)
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && initializedRef.current && !isRestoringRef.current) {
        const currentData = watch();
        saveFormData(currentData);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [watch, saveFormData]);

  return {
    saveData,
    clearData,
    hasStoredData,
    getStorageInfo
  };
}