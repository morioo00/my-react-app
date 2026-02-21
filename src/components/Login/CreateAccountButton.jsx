//import "../../index.css";
import "./styles/LoginButton.css";

export default function CreateAccountButton({ onClick, disabled }) {
  return (
    <button className="login-button" onClick={onClick}>
      新規作成
    </button>
  );
}