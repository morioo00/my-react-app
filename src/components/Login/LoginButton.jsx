import "./LoginButton.css";


function LoginButton({ onClick }) {
  return (
    <button className="login-button" onClick={onClick}>
      ログイン
    </button>
  );
}

export default LoginButton;
