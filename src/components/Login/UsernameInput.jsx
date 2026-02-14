function UsernameInput({ username, setUsername }) {
  return (
    <input
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      placeholder="ユーザー名"
    />
  );
}

export default UsernameInput;
