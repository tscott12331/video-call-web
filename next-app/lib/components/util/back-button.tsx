import Button from "./button";
import styles from './back-button.module.css';

export default function BackButton({
    ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <Button
        className={styles.backButton}
        {...rest}
        >
            <img src='/arrow-left.svg' />
        </Button>
    )
}
