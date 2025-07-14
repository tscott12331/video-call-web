import styles from './friend-card.module.css';

interface FriendCardProps {
    username: string,
    children?: React.ReactNode;
};

export default function FriendCard({
    username,
    children,
    ...rest
}: FriendCardProps & React.HTMLAttributes<HTMLDivElement>) {

    return (
        <div className={styles.friendWrapper}
            key={username}
            {...rest}
        >
            <div className={styles.friendWrapperLeft}>
                <div className={styles.pfpIconWrapper}></div>
                <p className={styles.friendUsername}>{username}</p>
            </div>
            {children}
        </div>
    )
}
