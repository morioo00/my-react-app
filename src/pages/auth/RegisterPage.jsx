import AuthLayout from "./AuthLayout";
import AuthCard from "./AuthCard";
import AuthTitle from "./AuthTitle";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <div
        style={{
          width: "min(720px, 100%)",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <AuthTitle
          title="花谷APP"
          subtitle="新規アカウント作成"
        />

        <AuthCard>
          {/* RegisterFormがここに入る */}
          <div style={{ height: 120 }} />
        </AuthCard>
      </div>
    </AuthLayout>
  );
}
