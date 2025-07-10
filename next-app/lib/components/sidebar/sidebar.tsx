import { useEffect, useState } from "react";
import styles from "./sidebar.module.css";
import { getRooms } from "@/lib/server-actions/friend";
import SidebarFriendCard from "./sidebar-friend-card";
import { TRoom } from "@/app/page";

interface SidebarProps {
    onAddFriendClick?: () => void;
    onFriendMessageClick?: (room: TRoom) => void;
    onFriendVideoClick?: (room: TRoom) => void;
    selectedRoom: TRoom|null|undefined;
}

export default function Sidebar({
    onAddFriendClick,
    onFriendMessageClick,
    onFriendVideoClick,
    selectedRoom,
}: SidebarProps) {
    const [roomList, setRoomList] = useState<TRoom[]>([]);

    const initRoomList = async () => {
        const list = await getRooms();
        if(list.success && list.rooms) {
            setRoomList(list.rooms);
        }
    }

    useEffect(() => {
        initRoomList();
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
                roomList.map(room =>
                    <SidebarFriendCard
                    room={room}
                    onFriendMessageClick={onFriendMessageClick}
                    onFriendVideoClick={onFriendVideoClick}
                    isSelected={room.id === selectedRoom?.id}
                    key={room.id}
                    />
                  )
            }
            </div>
        </section>);
}
