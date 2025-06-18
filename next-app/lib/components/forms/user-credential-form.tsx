"use client";
import { useActionState } from "react";
import styles from "./user-credential-form.module.css";

interface IUserCredentialActionReturn {
    error?: string;
    success?: boolean;
}

interface IUserCredentialFormProps {
    title?: string;
    buttonText?: string;
    anchorText?: string;
    anchorPath?: string;
    //formAction: any;
    formAction: (prevState: unknown, formData: FormData) => Promise<IUserCredentialActionReturn>
}

export default function UserCredentialForm({
    title="log in",
    buttonText="log in",
    anchorText="sign up",
    anchorPath="/signup",
    formAction,
}: IUserCredentialFormProps) {
    const [state, action, isPending] = useActionState(formAction, {});

    return (
            <div className={styles.formWrapper}>
                <div className={styles.formHeadWrapper}>
                    <h2>{title}</h2>
                </div>
                <form className={styles.form} action={action}>
                    <input className={styles.formInput} name="username" placeholder="username" />
                    <input className={styles.formInput} name="password" type="password" placeholder="password" />
                    <button type="submit">{buttonText}</button>
                </form>
                <div className={styles.anchorWrapper}>
                    <a href={anchorPath}>{anchorText}</a>
                </div>
            </div>
    );
}
