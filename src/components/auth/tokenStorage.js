const TOKEN_KEY = "authToken";

// JWT保存
export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

// JWT取得
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// JWT削除
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}