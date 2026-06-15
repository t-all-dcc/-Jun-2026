import { api } from './api';
import { ApiResponse } from '../types';

export const dbSync = {
  async read<T = any>(sheetName: string): Promise<ApiResponse<{ items: T[] }>> {
    try {
      // First, try to call the GAS backend
      const response = await api.post<any>('read', sheetName);
      if (response && response.status === 'success' && response.data) {
        const items = response.data.items || [];
        // save to local storage as cache/local replica
        localStorage.setItem(`dbsync_${sheetName}`, JSON.stringify(items));
        return {
          status: 'success',
          data: { items }
        };
      }
    } catch (err) {
      console.warn(`[dbSync] Failed to read from GAS backend for ${sheetName}, using local storage fallback:`, err);
    }

    // Local Storage fallback
    try {
      const stored = localStorage.getItem(`dbsync_${sheetName}`) || localStorage.getItem('local_employee_directory');
      const items = stored ? JSON.parse(stored) : [];
      return {
        status: 'success',
        data: { items }
      };
    } catch (err) {
      console.error(`[dbSync] Fallback failed for ${sheetName}:`, err);
      return {
        status: 'error',
        message: 'Could not read data from server or local storage fallback.'
      };
    }
  },

  async write<T = any>(sheetName: string, data: any): Promise<ApiResponse<T>> {
    // Save to local storage first (Optimistic UI fallback)
    try {
      const stored = localStorage.getItem(`dbsync_${sheetName}`) || localStorage.getItem('local_employee_directory');
      let items = stored ? JSON.parse(stored) : [];
      const dataArray = Array.isArray(data) ? data : [data];
      
      dataArray.forEach((newItem: any) => {
        const index = items.findIndex((item: any) => String(item.id) === String(newItem.id));
        if (index > -1) {
          items[index] = { ...items[index], ...newItem };
        } else {
          items.push(newItem);
        }
      });
      localStorage.setItem(`dbsync_${sheetName}`, JSON.stringify(items));
      localStorage.setItem('local_employee_directory', JSON.stringify(items));
    } catch (err) {
      console.error(`[dbSync] Failed to write local cache for ${sheetName}:`, err);
    }

    try {
      return await api.post('write', sheetName, data);
    } catch (err) {
      console.warn(`[dbSync] Failed online write to GAS backend for ${sheetName}, fell back to local cache:`, err);
      return {
        status: 'success',
        message: 'Saved to local storage fallback.'
      };
    }
  },

  async update<T = any>(sheetName: string, data: any): Promise<ApiResponse<T>> {
    // Save to local storage first (Optimistic UI fallback)
    try {
      const stored = localStorage.getItem(`dbsync_${sheetName}`) || localStorage.getItem('local_employee_directory');
      let items = stored ? JSON.parse(stored) : [];
      const dataArray = Array.isArray(data) ? data : [data];
      
      dataArray.forEach((updatedItem: any) => {
        const index = items.findIndex((item: any) => String(item.id) === String(updatedItem.id));
        if (index > -1) {
          items[index] = { ...items[index], ...updatedItem };
        } else {
          items.push(updatedItem);
        }
      });
      localStorage.setItem(`dbsync_${sheetName}`, JSON.stringify(items));
      localStorage.setItem('local_employee_directory', JSON.stringify(items));
    } catch (err) {
      console.error(`[dbSync] Failed to update local cache for ${sheetName}:`, err);
    }

    try {
      return await api.post('update', sheetName, data);
    } catch (err) {
      console.warn(`[dbSync] Failed online update to GAS backend for ${sheetName}, fell back to local cache:`, err);
      return {
        status: 'success',
        message: 'Saved to local storage fallback.'
      };
    }
  },

  async delete<T = any>(sheetName: string, data: any): Promise<ApiResponse<T>> {
    // Save to local storage first
    try {
      const stored = localStorage.getItem(`dbsync_${sheetName}`) || localStorage.getItem('local_employee_directory');
      let items = stored ? JSON.parse(stored) : [];
      const dataArray = Array.isArray(data) ? data : [data];
      
      const idsToDelete = dataArray.map((item: any) => String(item.id));
      items = items.filter((item: any) => !idsToDelete.includes(String(item.id)));
      localStorage.setItem(`dbsync_${sheetName}`, JSON.stringify(items));
      localStorage.setItem('local_employee_directory', JSON.stringify(items));
    } catch (err) {
      console.error(`[dbSync] Failed to delete in local cache for ${sheetName}:`, err);
    }

    try {
      return await api.post('delete', sheetName, data);
    } catch (err) {
      console.warn(`[dbSync] Failed online delete in GAS backend for ${sheetName}, fell back to local cache:`, err);
      return {
        status: 'success',
        message: 'Saved to local storage fallback.'
      };
    }
  }
};
