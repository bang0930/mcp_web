// src/lib/backendAPI.ts
// backend_api 서버(/api/predict 등)와 통신하는 전용 클라이언트

import { BACKEND_API_BASE_URL } from "./config";

export interface PredictGithubInfo {
  full_name?: string;
  description?: string;
  language?: string;
  stars?: number;
  forks?: number;
}

export interface PredictExtractedContext {
  service_type: string;
  expected_users: number;
  time_slot: string;
  runtime_env?: string;
  curr_cpu: number;
  curr_mem: number;
  reasoning?: string;
}

export interface PredictRecommendations {
  flavor?: string | null;
  cost_per_day?: number | null;
  notes?: string | null;
}

export interface PredictResponse {
  success: boolean;
  github_info: PredictGithubInfo;
  extracted_context: PredictExtractedContext;
  predictions: Record<string, any>;
  recommendations: PredictRecommendations;
}

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
  }): Promise<PredictResponse> => {
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
    const data: PredictResponse = await handleResponse(res);
    return data;
  },
};


