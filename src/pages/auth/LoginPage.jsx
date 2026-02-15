import AuthLayout from "../../components/Login/AuthLayout";
import AuthCard from "../../components/Login/AuthCard";
import AuthTitle from "../../components/Login/AuthTitle";
import LoginForm from "../../components/Login/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthTitle
        title="花谷APP"
        subtitle="～ 花谷の花谷による花谷の為のAPP ～"
      />
      <AuthCard>
        <LoginForm />
      </AuthCard>
    </AuthLayout>
  );
}
