import { friend } from './sidebar';
import styles from './sidebar-friend-card.module.css';

interface SidebarFriendCardProps {
    onFriendMessageClick?: (friendUsername: string) => void;
    onFriendVideoClick?: (friendUsername: string) => void;
    friend: friend;
    isSelected: boolean;
}

export default function SidebarFriendCard({
    onFriendVideoClick,
    onFriendMessageClick,
    friend,
    isSelected,
}: SidebarFriendCardProps) {
    const handleControlClick = (e: React.MouseEvent<HTMLDivElement>, friendUsername: string, type: 'video' | 'message') => {
        e.stopPropagation();
        if(type === 'message') {
            onFriendMessageClick?.(friendUsername);
        } else if (type === 'video') {
            onFriendVideoClick?.(friendUsername);
        }
    }

    return (
        <div 
        className={styles.sbFriend}
        onClick={(e) => handleControlClick(e, friend.username, 'message')}
        data-selected={isSelected ? "true" : "false"}
        >
            <div className={styles.sbFriendLeft}>
                <div className={styles.pfpSmallWrapper}></div>
                <p className={styles.sbFriendName}>{friend.username}</p>
            </div>
            <div className={styles.sbFriendRight}>
                <div 
                className={styles.messageSmallIcon}
                onClick={(e) => handleControlClick(e, friend.username, 'message')}
                ></div>
                <div 
                className={styles.videoSmallIcon}
                onClick={(e) => handleControlClick(e, friend.username, 'video')}
                ></div>
            </div>
        </div>
    );
}
