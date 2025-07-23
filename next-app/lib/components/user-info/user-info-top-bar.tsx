import { TRoom } from '@/app/page';
import styles from './user-info-top-bar.module.css';

interface RoomInfoTopBarProps {
    absolutePosition?: 'top' | 'bottom';
    visible?: boolean;
    room: TRoom;
    onControlClick?: () => void;
    username: string|null|undefined;
    children?: React.ReactNode;
}

export default function RoomInfoTopBar({
    absolutePosition,
    visible = true,
    room,
    onControlClick,
    username,
    children,
    ...rest
}: RoomInfoTopBarProps & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={styles.mainInfoWrapper}
        style={absolutePosition ?
                {
                    visibility: visible ? 'visible' : 'hidden',
                    position: 'absolute',
                    top: absolutePosition === 'top' ? 0 : undefined,
                    bottom: absolutePosition === 'bottom' ? 0 : undefined,
                    borderBottom: absolutePosition === 'bottom' ? 'none' :
                                    '1px solid black',

                    borderTop: absolutePosition === 'bottom' ? '1px solid black' :
                                    'none',
                    width: '100%',
                }
            :
                {
                    visibility: visible ? 'visible' : 'hidden',
                }
        }
        {...rest}
        >
            <div className={styles.mainIconTextWrapper}>
                <div className={styles.pfpBigIcon}></div>
                <p className={styles.infoUsername}>{
                    room.users.length > 2 ?
                    room.name :
                    room.users.find(user => user !== username)
                }</p>
            </div>
            <div 
            className={styles.bigIcon}
            onClick={() => onControlClick?.()}
            >
                {children}
            </div>
        </div>
    )
}
