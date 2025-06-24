import { useEffect, useState } from "react";
import styles from "./sidebar.module.css";
import { getFriends } from "@/lib/server-actions/friend";

interface SidebarProps {
    onAddFriendClick?: () => void;
}

type friend = {
    username: string;
}

export default function Sidebar({
    onAddFriendClick,
}: SidebarProps) {
    const [friendList, setFriendList] = useState<friend[]>([]);

    const initFriendList = async () => {
        const list = await getFriends();
        if(list.success) {
            setFriendList(list.friendList);
        }
    }

    useEffect(() => {
        initFriendList();
    }, [])

    return (
        <section className={styles.sbSection}>
            <div className={styles.sbCtrls}>
                <div className={styles.sbCtrlsTop}>
                    <div className={styles.pfpWrapper}></div>
                    <div className={styles.addFriendWrapper}
                    onClick={onAddFriendClick}
                    >
                        <img src="/plus.svg" />
                    </div>
                </div>
                <div className={styles.sbSearchWrapper}>
                    <input placeholder="search friends" className={styles.sbSearch} />
                    <button className={styles.sbSearchBut}>search</button>
                </div>
            </div>
            <div className={styles.sbFriendsList}>
            {
                friendList.map(friend =>
                    <div 
                    className={styles.sbFriend}
                    key={friend.username}
                    >
                        <div className={styles.sbFriendLeft}>
                            <div className={styles.pfpSmallWrapper}></div>
                            <p className={styles.sbFriendName}>{friend.username}</p>
                        </div>
                        <div className={styles.sbFriendRight}>
                            <div className={styles.messageSmallIcon}></div>
                            <div className={styles.videoSmallIcon}></div>
                        </div>
                    </div>
                              )
            }
            </div>
        </section>);
}
