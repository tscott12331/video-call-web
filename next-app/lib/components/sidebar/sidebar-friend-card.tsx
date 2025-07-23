import { TRoom } from '@/app/page';
import styles from './sidebar-friend-card.module.css';

interface SidebarFriendCardProps {
    onFriendMessageClick?: (room: TRoom) => void;
    onFriendVideoClick?: (room: TRoom) => void;
    room: TRoom;
    isSelected: boolean;
    numUnread: number;
    username: string|null|undefined;
}

export default function SidebarFriendCard({
    onFriendVideoClick,
    onFriendMessageClick,
    room,
    isSelected,
    numUnread,
    username,
}: SidebarFriendCardProps) {
    const handleControlClick = (e: React.MouseEvent<HTMLDivElement>, type: 'video' | 'message') => {
        e.stopPropagation();
        if(type === 'message') {
            onFriendMessageClick?.(room);
        } else if (type === 'video') {
            onFriendVideoClick?.(room);
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
                <p className={styles.sbFriendName}>{
                    room.users.length > 2 ?
                    room.name :
                    room.users.find(user => user !== username)
                }</p>
            </div>
            <div className={styles.sbFriendRight}>
                <div 
                className={styles.messageSmallIcon}
                onClick={(e) => handleControlClick(e, 'message')}
                >
                    <img src='/message-icon.svg' />
                    {
                        numUnread > 0 &&
                        <div className={styles.notification}>{
                            numUnread > 5 ? "!!"
                            :
                            numUnread
                        }</div>
                    }
                </div>
                {
                room.users.length <= 2 &&
                <div 
                className={styles.videoSmallIcon}
                onClick={(e) => handleControlClick(e, 'video')}
                >
                    <img src='/video-icon.svg' />
                </div>
                }
            </div>
        </div>
    );
}
