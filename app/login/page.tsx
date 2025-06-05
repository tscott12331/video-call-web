import styles from "./page.module.css";
import UserCredentialForm from "@/lib/components/forms/user-credential-form";

export default function Login() {
    return (
        <div className={styles.page}>
            <UserCredentialForm />
        </div>
    );
}
