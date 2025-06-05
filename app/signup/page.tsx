import styles from "./page.module.css";
import UserCredentialForm from "@/lib/components/forms/user-credential-form";
import { signup } from "@/lib/server-actions/auth";

export default function Signup() {
    return (
        <div className={styles.page}>
            <UserCredentialForm 
                title="sign up"
                buttonText="sign up"
                anchorText="log in"
                anchorPath="/login"
                formAction={signup}
            />
        </div>
    )
}
