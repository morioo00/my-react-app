import AuthLayout from "../../components/Login/AuthLayout";
import AuthCard from "../../components/Login/AuthCard";
import AuthTitle from "../../components/Login/AuthTitle";
import LoginForm from "../../components/Login/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout>
      <div
        style={{
          width: "min(720px, 100%)",
          display: "flex",
          flexDirection: "column",  // ← 縦並び
          alignItems: "center",     // ← 中央寄せ
          gap: 32,                  // ← 上下の間隔
        }}
      >
        {/* 上：タイトル */}
        <AuthTitle
          title="花谷APP"
          subtitle="～ 花谷の花谷による花谷の為のAPP ～"
        />

        {/* 下：フォーム */}
        <AuthCard>
          <LoginForm />
        </AuthCard>
      </div>
    </AuthLayout>
  );
}
