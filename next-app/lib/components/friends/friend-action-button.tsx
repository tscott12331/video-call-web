import Button from "../util/button";
import styles from './friend-action-button.module.css';

interface FriendActionButtonProps {
    friendStatus: 'unadded' | 'pending' | 'added';
    onFriendAction?: () => void;
}
export default function FriendActionButton({
    friendStatus,
    onFriendAction,
}: FriendActionButtonProps) {
    return (
        <Button
        className={styles.actionButton}
        onClick={() => onFriendAction?.()}
        >
            <img src={friendStatus === "unadded" ?
                '/plus.svg' :
                friendStatus === "pending" ?
                '/pending.svg' :
                '/added.svg' } />
        </Button>
    )
}
