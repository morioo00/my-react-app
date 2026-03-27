// authFetch.js
import { getToken } from "./tokenStorage";

export default async function authFetch(url, options = {}) {
  const token = getToken();
  console.log("authFetch token:", token); // ←ここでブラウザに出力されるか確認

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`; // ←バックエンドが期待する形式
  }

  return fetch(url, {
    ...options,
    headers,
  });
}