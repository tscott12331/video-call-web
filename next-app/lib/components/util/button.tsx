import styles from './button.module.css';

interface ButtonProps {
    
    children?: React.ReactNode;
}

export default function Button({
    children,
    ...rest
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button className={styles.myButton} {...rest}>
            {children}
        </button>
    )
}
