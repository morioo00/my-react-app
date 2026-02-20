import AuthLayout from "../Login/AuthLayout";
import AuthCard from "../Login/AuthCard";
import AuthTitle from "../Login/AuthTitle";
import NewAccountForm from "../Login/NewAccountForm";


export default function NewAccountPage() {
  return (
    <AuthLayout>
      <div
        style={{
          width: "min(720px, 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* タイトル */}
        <AuthTitle
          title="新規アカウント作成"
          subtitle="必要な情報を入力してください"
        />

        {/* フォーム */}
        <AuthCard>
          <NewAccountForm />
        </AuthCard>
      </div>
    </AuthLayout>
  );
}
