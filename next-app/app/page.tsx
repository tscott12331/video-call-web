"use client"

import styles from "./page.module.css";
import Sidebar from "@/lib/components/sidebar/sidebar";
import MessageArea from "@/lib/components/messaging/message-area";
import VideoArea from "@/lib/components/video/video-area";
import AddFriendsPopup from "@/lib/components/friends/add-friends-popup";
import { useEffect, useState } from "react";


export default function Home() {
    const [showAddFriends, setShowAddFriends] = useState<boolean>(false);
    const toggleAddFriendPopup = () => {
        setShowAddFriends(!showAddFriends);
    }

    const onPopupClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation();
    }

    return (
        <div className={styles.page}
            onClick={() => showAddFriends && setShowAddFriends(false)}
        >
            <Sidebar onAddFriendClick={toggleAddFriendPopup}/>
            <MessageArea />
            {showAddFriends &&
                <AddFriendsPopup 
                onClick={onPopupClick}
                />
            }
        </div> 
    );
}
