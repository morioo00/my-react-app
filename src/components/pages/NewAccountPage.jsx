import AuthLayout from "../Login/AuthLayout";
import AuthCard from "../Login/AuthCard";
import AuthTitle from "../Login/AuthTitle";
import NewAccountForm from "../Login/NewAccountForm";
import styles from "../Login/styles/LoginPage.module.css";


export default function NewAccountPage() {
  return (
    <AuthLayout>
      <div className={styles.container}>
        <AuthTitle
          title="新規アカウント作成"
          subtitle="必要な情報を入力してください"
        />

        <AuthCard>
          <NewAccountForm />
        </AuthCard>
      </div>
    </AuthLayout>
  );
}