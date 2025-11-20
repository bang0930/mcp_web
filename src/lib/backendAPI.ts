// src/lib/backendAPI.ts
// backend_api 서버(/api/predict 등)와 통신하는 전용 클라이언트

import { BACKEND_API_BASE_URL } from "./config";

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    let errorMessage = "요청에 실패했습니다.";
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

export const backendApi = {
  // 자연어 + GitHub URL을 받아 backend_api의 /api/predict 호출
  predictWithNaturalLanguage: async (params: {
    github_url: string;
    user_input: string;
  }) => {
    const res = await fetch(`${BACKEND_API_BASE_URL}/api/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        github_url: params.github_url,
        user_input: params.user_input,
      }),
    });
    return handleResponse(res);
  },
};


