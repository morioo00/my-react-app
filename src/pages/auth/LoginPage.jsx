
import AuthLayout from "../../components/Login/AuthLayout";
import AuthCard from "../../components/Login/AuthCard";
import AuthTitle from "../../components/Login/AuthTitle";


export default function LoginPage() {
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
          subtitle="～ 花谷の花谷による花谷の為のAPP ～"
        />

        <AuthCard>
          {/* ここに別の人がフォームを入れる */}
          <div style={{ height: 120 }} />
        </AuthCard>
      </div>
    </AuthLayout>
  );
}

//ここから呼び出しのCSSがいる
//