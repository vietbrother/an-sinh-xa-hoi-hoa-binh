import { User, UserRole, UserStatus } from '../types';

const BASE_URL = 'https://script.google.com/macros/s/AKfycbwa2GxyAIs9tZ5fgDeVG80ZP24ELPY5P8HYlK850PhQszBkOYBTdxmOv890hIYBA4oT/exec';
const SECRET_TOKEN = 'MTTQ_HOABINH_2026_SECRET';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface CreateUserData {
  username: string;
  fullName: string;
  password?: string;
  email?: string;
  status?: UserStatus | string;
  role: UserRole;
}

export interface UpdateUserData extends CreateUserData {
  id: string;
}

async function parseResponse(response: Response): Promise<any> {
  const text = await response.text();
  try {
    const data = JSON.parse(text);
    if (typeof data === 'string') {
      return JSON.parse(data);
    }
    return data;
  } catch (e) {
    console.error('Failed to parse JSON response:', text);
    return { success: false, message: 'Phản hồi từ máy chủ không hợp lệ' };
  }
}

/**
 * Get all users list
 */
export async function getUsers(): Promise<ApiResponse<User[]>> {
  try {
    const url = `${BASE_URL}?action=list&token=${encodeURIComponent(SECRET_TOKEN)}`;
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    const result = await parseResponse(response);
    return result;
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      message: error.message || 'Không thể kết nối đến máy chủ',
      data: null,
    };
  }
}

/**
 * Get user detail by ID
 */
export async function getUserDetail(id: string): Promise<ApiResponse<User>> {
  try {
    const url = `${BASE_URL}?action=get&id=${encodeURIComponent(id)}&token=${encodeURIComponent(SECRET_TOKEN)}`;
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    const result = await parseResponse(response);
    return result;
  } catch (error: any) {
    console.error(`Error fetching user detail ${id}:`, error);
    return {
      success: false,
      message: error.message || 'Không thể lấy thông tin người dùng',
      data: null,
    };
  }
}

/**
 * Create a new user
 */
export async function createUser(userData: CreateUserData): Promise<ApiResponse<{ id: string }>> {
  try {
    const payload = {
      token: SECRET_TOKEN,
      action: 'create',
      data: userData,
    };

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await parseResponse(response);
    return result;
  } catch (error: any) {
    console.error('Error creating user:', error);
    return {
      success: false,
      message: error.message || 'Lỗi hệ thống khi tạo người dùng',
      data: null,
    };
  }
}

/**
 * Update an existing user
 */
export async function updateUser(userData: UpdateUserData): Promise<ApiResponse<{ id: string }>> {
  try {
    const payload = {
      token: SECRET_TOKEN,
      action: 'update',
      data: userData,
    };

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await parseResponse(response);
    return result;
  } catch (error: any) {
    console.error('Error updating user:', error);
    return {
      success: false,
      message: error.message || 'Lỗi hệ thống khi cập nhật người dùng',
      data: null,
    };
  }
}

/**
 * Delete a user by ID
 */
export async function deleteUser(id: string): Promise<ApiResponse<{ id: string }>> {
  try {
    const payload = {
      token: SECRET_TOKEN,
      action: 'delete',
      id: id,
    };

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await parseResponse(response);
    return result;
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      message: error.message || 'Lỗi hệ thống khi xóa người dùng',
      data: null,
    };
  }
}
