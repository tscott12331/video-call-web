import styles from "./page.module.css";
import UserCredentialForm from "@/lib/components/forms/user-credential-form";
import { login } from "@/lib/server-actions/auth";

export default function Login() {
    return (
        <div className={styles.page}>
            <UserCredentialForm formAction={login} />
        </div>
    );
}
