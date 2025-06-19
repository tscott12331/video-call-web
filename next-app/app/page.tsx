"use client"

import styles from "./page.module.css";
import Sidebar from "@/lib/components/sidebar/sidebar";
import MessageArea from "@/lib/components/messaging/message-area";
import VideoArea from "@/lib/components/video/video-area";
import AddFriendsPopup from "@/lib/components/friends/add-friends-popup";
import { useState } from "react";


export default function Home() {
    const [showAddFriends, setShowAddFriends] = useState<boolean>(false);
    const toggleAddFriendPopup = () => {
        setShowAddFriends(!showAddFriends);
    }

    return (
        <div className={styles.page}>
        <Sidebar onAddFriendClick={toggleAddFriendPopup}/>
        <MessageArea />
        {showAddFriends &&
            <AddFriendsPopup />
        }
        </div> 
    );
}
