import styles from "./user-credential-form.module.css";

interface IUserCredentialFormProps {
    title?: string;
    buttonText?: string;
    anchorText?: string;
    anchorPath?: string; }
export default function UserCredentialForm({
    title="log in",
    buttonText="log in",
    anchorText="sign up",
    anchorPath="/signup",
}: IUserCredentialFormProps) {
    return (
            <div className={styles.formWrapper}>
                <div className={styles.formHeadWrapper}>
                    <h2>{title}</h2>
                </div>
                <form className={styles.form}>
                    <input className={styles.formInput} placeholder="username" />
                    <input className={styles.formInput} type="password" placeholder="password" />
                    <button type="submit">{buttonText}</button>
                </form>
                <div className={styles.anchorWrapper}>
                    <a href={anchorPath}>{anchorText}</a>
                </div>
            </div>
    );
}
