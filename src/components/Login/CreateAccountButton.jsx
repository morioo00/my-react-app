import "./styles/LoginButton.css";

export default function CreateAccountButton({ onClick, disabled }) {
  return (
    <button
      type="button"
      className="login-button"
      onClick={onClick}
      disabled={disabled}
    >
      {disabled ? "登録中..." : "新規作成"}
    </button>
  );
}