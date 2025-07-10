import styles from './user-info-top-bar.module.css';

interface RoomInfoTopBarProps {
    absolutePosition?: 'top' | 'bottom';
    visible?: boolean;
    roomName: string;
    onControlClick?: () => void;
}

export default function RoomInfoTopBar({
    absolutePosition,
    visible = true,
    roomName,
    onControlClick,
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
                <p className={styles.infoUsername}>{roomName}</p>
            </div>
            <div 
            className={styles.bigIcon}
            onClick={() => onControlClick?.()}
            ></div>
        </div>
    )
}
