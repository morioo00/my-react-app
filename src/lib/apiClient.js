const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// 将来 Supabase token をここで取得する
function getAccessToken() {
  return localStorage.getItem("access_token"); // Step5で差し替え
}

async function request(path, options = {}) {
  const token = getAccessToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // 共通エラーハンドリング
  if (!res.ok) {
    const text = await res.text();
    console.error("API Error:", res.status, text);
    throw new Error(`API Error: ${res.status}`);
  }

  // JSON or 空レスポンス対応
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }

  return res.text();
}

// 共通API
export const apiClient = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: (path, body) =>
    request(path, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: (path) =>
    request(path, {
      method: "DELETE",
    }),
};