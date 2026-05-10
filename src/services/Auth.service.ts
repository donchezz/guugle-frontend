/* eslint-disable @typescript-eslint/no-explicit-any */
// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface PasswordChangeRecord {
  id: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  changedAt: string;
}

class AuthService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  async changePassword(data: ChangePasswordData): Promise<any> {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPasswordHistory(): Promise<PasswordChangeRecord[]> {
    return this.request('/auth/password-history');
  }
}

export default new AuthService();