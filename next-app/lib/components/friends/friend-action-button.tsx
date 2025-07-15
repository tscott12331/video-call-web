import Button from "../util/button";
import styles from './friend-action-button.module.css';

interface FriendActionButtonProps {
    friendStatus: 'unadded' | 'pending' | 'added';
    onFriendAction?: () => void;
    remove?: boolean;
}
export default function FriendActionButton({
    friendStatus,
    onFriendAction,
    remove = false,
}: FriendActionButtonProps) {
    return (
        <Button
        className={styles.actionButton}
        onClick={() => onFriendAction?.()}
        >
            {
                remove ?
                <img 
                    src='/plus.svg' 
                    className={styles.x}
                />
                :
                <img src={friendStatus === "unadded" ?
                    '/plus.svg' :
                    friendStatus === "pending" ?
                    '/pending.svg' :
                    '/added.svg' } />
            }
        </Button>
    )
}
