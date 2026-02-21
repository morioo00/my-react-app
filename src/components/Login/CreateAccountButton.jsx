import "../../index.css";

export default function CreateAccountButton({ onClick, disabled }) {
  return (
    <button
      className="new-account-button"
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      新規作成
    </button>
  );
}