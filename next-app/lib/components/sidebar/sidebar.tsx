import { useEffect, useState } from "react";
import styles from "./sidebar.module.css";
import { getFriends } from "@/lib/server-actions/friend";
import SidebarFriendCard from "./sidebar-friend-card";

interface SidebarProps {
    onAddFriendClick?: () => void;
    onFriendMessageClick?: (fr: Friend) => void;
    onFriendVideoClick?: (fr: Friend) => void;
    selectedFriend: Friend|null|undefined;
}

export type Friend = {
    username: string;
    roomId: string;
}

export default function Sidebar({
    onAddFriendClick,
    onFriendMessageClick,
    onFriendVideoClick,
    selectedFriend,
}: SidebarProps) {
    const [friendList, setFriendList] = useState<Friend[]>([]);

    const initFriendList = async () => {
        const list = await getFriends();
        if(list.success && list.friendList) {
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
                    <SidebarFriendCard
                    friend={friend}
                    onFriendMessageClick={onFriendMessageClick}
                    onFriendVideoClick={onFriendVideoClick}
                    isSelected={friend.username === selectedFriend?.username}
                    key={friend.username}
                    />
                  )
            }
            </div>
        </section>);
}
