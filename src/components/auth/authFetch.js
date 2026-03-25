import { getToken } from "./tokenStorage";

// JWTを自動でAuthorizationヘッダーに付ける共通fetch
export default async function authFetch(url, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
  };

  // JWTがあるときだけ Bearer ヘッダーを付ける
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
}