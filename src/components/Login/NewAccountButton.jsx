import { useNavigate } from "react-router-dom";
import "../../index.css";


export default function NewAccountButton() {
  const navigate = useNavigate();

  return (
    <button className="new-account-button" onClick={() => navigate("/new-account")}>
      新規作成
    </button>
  );
}
