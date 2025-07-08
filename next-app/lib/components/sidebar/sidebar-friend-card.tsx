import { Friend } from './sidebar';
import styles from './sidebar-friend-card.module.css';

interface SidebarFriendCardProps {
    onFriendMessageClick?: (fr: Friend) => void;
    onFriendVideoClick?: (fr: Friend) => void;
    friend: Friend;
    isSelected: boolean;
}

export default function SidebarFriendCard({
    onFriendVideoClick,
    onFriendMessageClick,
    friend,
    isSelected,
}: SidebarFriendCardProps) {
    const handleControlClick = (e: React.MouseEvent<HTMLDivElement>, type: 'video' | 'message') => {
        e.stopPropagation();
        if(type === 'message') {
            onFriendMessageClick?.(friend);
        } else if (type === 'video') {
            onFriendVideoClick?.(friend);
        }
    }

    return (
        <div 
        className={styles.sbFriend}
        onClick={(e) => handleControlClick(e, 'message')}
        data-selected={isSelected ? "true" : "false"}
        >
            <div className={styles.sbFriendLeft}>
                <div className={styles.pfpSmallWrapper}></div>
                <p className={styles.sbFriendName}>{friend.username}</p>
            </div>
            <div className={styles.sbFriendRight}>
                <div 
                className={styles.messageSmallIcon}
                onClick={(e) => handleControlClick(e, 'message')}
                ></div>
                <div 
                className={styles.videoSmallIcon}
                onClick={(e) => handleControlClick(e, 'video')}
                ></div>
            </div>
        </div>
    );
}
