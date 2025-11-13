// src/lib/authAPI.ts

import { API_BASE_URL } from './config';

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    let errorMessage = '요청에 실패했습니다.';
    try {
      const errorData = await res.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
      errorMessage = res.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return res.json();
};

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);  // { access_token, token_type }
  },

  signup: async (formData: any) => {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    return handleResponse(res);
  },

  // 프로젝트 정보 업데이트 (사용자 정보 업데이트)
  updateProject: async (projectData: {
    github_repo_url: string;
    expected_users: number;
  }, token: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(projectData)
    });
    return handleResponse(res);
  },

  // 회원 탈퇴
  deleteAccount: async (token: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/delete`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(res);
  }
};
