import AuthLayout from "../Login/AuthLayout";
import AuthCard from "../Login/AuthCard";
import AuthTitle from "../Login/AuthTitle";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthTitle
          title="花谷APP"
          subtitle="～ 花谷の花谷による花谷の為のAPP ～"
        />

        {/* ここに他チームの登録フォーム（テキストボックス等）を入れていく */}
      </AuthCard>
    </AuthLayout>
  );
}
