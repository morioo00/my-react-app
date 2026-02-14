function PasswordInput({ password, setPassword }) {
  return (
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="パスワード"
    />
  );
}

export default PasswordInput;
