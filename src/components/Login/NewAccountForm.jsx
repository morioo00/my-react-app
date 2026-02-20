import { useState } from "react";
import UsernameInput from "./UsernameInput";
import PasswordInput from "./PasswordInput";
import NewAccountButton from "./NewAccountButton";
import { useNavigate } from "react-router-dom";


export default function NewAccountForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    console.log("新規作成:", username, password);
  };

  return (
  <div>
    <UsernameInput username={username} setUsername={setUsername} />
    <PasswordInput password={password} setPassword={setPassword} />

    <div className="button-group">
      <NewAccountButton onClick={handleRegister} />

      <button onClick={() => navigate("/")}>
        戻る
      </button>
    </div>
  </div>
);

}
