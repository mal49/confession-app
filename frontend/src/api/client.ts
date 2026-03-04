/**
 * API Client for Confession App
 * Handles communication with Cloudflare Worker backend
 */

import type { 
  ApiResponse, 
  CreateConfessionRequest, 
  ConfessionSubmitResponse,
  PendingConfessionsResponse,
  ModerationActionResponse,
  AdminStatsResponse
} from '../../../shared/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }
    
    return data as ApiResponse<T>;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Confession API methods
 */
export const confessionApi = {
  /**
   * Submit a new confession
   */
  async submit(data: CreateConfessionRequest): Promise<ApiResponse<ConfessionSubmitResponse>> {
    return fetchApi<ConfessionSubmitResponse>('/api/confession', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get pending confessions (admin only)
   */
  async getPending(limit = 20, offset = 0): Promise<ApiResponse<PendingConfessionsResponse>> {
    return fetchApi<PendingConfessionsResponse>(`/api/confession/pending?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'X-API-Key': import.meta.env.VITE_ADMIN_API_KEY || '',
      },
    });
  },

  /**
   * Approve a confession (admin only)
   */
  async approve(id: number, notes?: string): Promise<ApiResponse<ModerationActionResponse>> {
    return fetchApi<ModerationActionResponse>(`/api/confession/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
      headers: {
        'X-API-Key': import.meta.env.VITE_ADMIN_API_KEY || '',
      },
    });
  },

  /**
   * Reject a confession (admin only)
   */
  async reject(id: number, notes?: string): Promise<ApiResponse<ModerationActionResponse>> {
    return fetchApi<ModerationActionResponse>(`/api/confession/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
      headers: {
        'X-API-Key': import.meta.env.VITE_ADMIN_API_KEY || '',
      },
    });
  },
};

/**
 * Admin API methods
 */
export const adminApi = {
  /**
   * Get admin dashboard stats
   */
  async getStats(): Promise<ApiResponse<AdminStatsResponse>> {
    return fetchApi<AdminStatsResponse>('/api/admin/stats', {
      method: 'GET',
      headers: {
        'X-API-Key': import.meta.env.VITE_ADMIN_API_KEY || '',
      },
    });
  },
};

/**
 * Health check
 */
export async function healthCheck(): Promise<ApiResponse<{ message: string; timestamp: string }>> {
  return fetchApi<{ message: string; timestamp: string }>('/api/health');
}

export default {
  confession: confessionApi,
  admin: adminApi,
  health: healthCheck,
};
