import { useEffect, useState } from "react";
import styles from "./sidebar.module.css";
import { getRooms } from "@/lib/server-actions/friend";
import SidebarFriendCard from "./sidebar-friend-card";
import { TNotifications, TRoom } from "@/app/page";
import Button from "../util/button";
import { logout } from "@/lib/server-actions/auth";

interface SidebarProps {
    onAddFriendClick?: () => void;
    onFriendMessageClick?: (room: TRoom) => void;
    onFriendVideoClick?: (room: TRoom) => void;
    selectedRoom: TRoom|null|undefined;
    newRoom: boolean;
    notifications: TNotifications;
}

export default function Sidebar({
    onAddFriendClick,
    onFriendMessageClick,
    onFriendVideoClick,
    selectedRoom,
    newRoom,
    notifications,
}: SidebarProps) {
    const [roomList, setRoomList] = useState<TRoom[]>([]);
    const [showProfilePopup, setShowProfilePopup] = useState<boolean>(false);

    const initRoomList = async () => {
        const list = await getRooms();
        if(list.success && list.rooms) {
            setRoomList(list.rooms);
        }
    }

    const handlePopupClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    }

    useEffect(() => {
        initRoomList();
    }, [newRoom])

    return (
        <section className={styles.sbSection}
            onClick={() => showProfilePopup && setShowProfilePopup(false)}
        >
            <div className={styles.sbCtrls}>
                <div className={styles.sbCtrlsTop}>
                    <div 
                        className={styles.pfpWrapper}
                        onClick={() => setShowProfilePopup(true)}
                    >
                    {
                        showProfilePopup &&
                        <div className={styles.profilePopup}
                            onClick={handlePopupClick}
                        >
                            <a 
                                className={styles.profilePopupItem}
                                href='/edit-profile'
                            >edit profile</a>
                            <Button 
                                className={styles.profilePopupItem}
                                onClick={() => logout()}
                            >log out</Button>
                        </div>
                    }
                    </div>
                    <div className={styles.addFriendWrapper}
                    onClick={onAddFriendClick}
                    >
                        <img src="/plus.svg" />
                    </div>
                </div>
                <div className={styles.sbSearchWrapper}>
                    <input placeholder="search rooms" className={styles.sbSearch} />
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
                    numUnread={notifications[room.id] !== undefined ? notifications[room.id] : 0}
                    key={room.id}
                    />
                  )
            }
            </div>
        </section>);
}
