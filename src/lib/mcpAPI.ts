// src/lib/mcpAPI.ts

import { API_BASE_URL, DEPLOY_API_BASE_URL } from './config';

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    let errorMessage = '예측 요청에 실패했습니다.';
    try {
      const errorData = await res.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
      if (res.status === 401) {
        errorMessage = '인증이 만료되었습니다. 다시 로그인해주세요.';
      } else if (res.status === 403) {
        errorMessage = '접근 권한이 없습니다.';
      } else {
        errorMessage = res.statusText || errorMessage;
      }
    }
    throw new Error(errorMessage);
  }
  return res.json();
};

export const mcpApi = {
  // Context JSON을 예쁘게 포장해서 MCP로 전송
  // 배포는 MCP -> mcp_core -> CI/CD로 자동 처리됨
  sendContextToMCP: async (payload: any, token: string) => {
    // Context JSON을 예쁘게 포장해서 MCP로 전송
    // 프론트엔드에서는 GitHub URL만 전달하고, 나머지 필드들은 MCP가 자동으로 채움
    // 자연어 요청사항은 별도 필드로 전송
    const formattedPayload = {
      service_id: payload.service_id,
      metric_name: payload.metric_name,
      context: {
        github_url: payload.context.github_url,
        // 나머지 필드들(timestamp, service_type, runtime_env, time_slot, weight, region, curr_cpu, curr_mem, expected_users)은 MCP가 채움
      },
      requirements: payload.requirements, // 자연어 요청사항 (string으로 래핑)
    }

    const res = await fetch(`${API_BASE_URL}/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formattedPayload, null, 2) // 예쁘게 포장된 JSON
    });
    return handleResponse(res);
  },

  // 배포 요청 (8001 포트 사용)
  deploy: async (deployData: {
    service_id: string;
    repo_id?: string;
    image_tag?: string;
    env_config?: Record<string, any>;
  }, token: string) => {
    const res = await fetch(`${DEPLOY_API_BASE_URL}/deploy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(deployData)
    });
    return handleResponse(res);
  },

  // 리소스 삭제
  destroy: async (destroyData: {
    service_id: string;
    instance_id: string;
  }, token: string) => {
    const res = await fetch(`${API_BASE_URL}/destroy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(destroyData)
    });
    return handleResponse(res);
  }
};
