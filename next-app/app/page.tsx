"use client"

import styles from "./page.module.css";
import Sidebar from "@/lib/components/sidebar/sidebar";
import MessageArea from "@/lib/components/messaging/message-area";
import VideoArea from "@/lib/components/video/video-area";
import AddFriendsPopup from "@/lib/components/friends/add-friends-popup";
import { useEffect, useState } from "react";
import { SSE_URL } from "@/endpoints";

enum MAIN_AREA {
    NONE,
    MESSAGE_AREA,
    MESSAGE_AREA_NO_USER,
    VIDEO_AREA,
    VIDEO_AREA_NO_USER,
}

export default function Home() {
    const [showAddFriends, setShowAddFriends] = useState<boolean>(false);
    const [mainArea, setMainArea] = useState<MAIN_AREA>(MAIN_AREA.NONE);
    const [selectedFriend, setSelectedFriend] = useState<string|null|undefined>();
    const toggleAddFriendPopup = () => {
        setShowAddFriends(!showAddFriends);
    }

    const onPopupClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation();
    }

    const handleMainAreaChange = (areaType: MAIN_AREA, selectedUser: string) => {
        setMainArea(areaType);
        setSelectedFriend(selectedUser);
    }

    const renderMainArea = () => {
        switch(mainArea) {
            case MAIN_AREA.MESSAGE_AREA_NO_USER:
            case MAIN_AREA.VIDEO_AREA_NO_USER:
            case MAIN_AREA.NONE:
                return <p>nada</p>;
            case MAIN_AREA.MESSAGE_AREA:
                if(!selectedFriend) {
                    setMainArea(MAIN_AREA.MESSAGE_AREA_NO_USER);
                    return;
                }
                return <MessageArea 
                friendUsername={selectedFriend}
                onVideoClick={() => handleMainAreaChange(MAIN_AREA.VIDEO_AREA, selectedFriend)}
                />
            case MAIN_AREA.VIDEO_AREA:
                if(!selectedFriend) {
                    setMainArea(MAIN_AREA.VIDEO_AREA_NO_USER);
                    return;
                }
                return <VideoArea 
                friendUsername={selectedFriend} 
                onMessageClick={() => handleMainAreaChange(MAIN_AREA.MESSAGE_AREA, selectedFriend)}
                />
        }
    }

    useEffect(() => {
        const evtSrc = new EventSource(`${SSE_URL}/chat-listen`, {
            withCredentials: true
        });

        const onSSEMessage = (e: MessageEvent) => {
            console.log(e);
        }

        const onSSEError = (e: Event) => {
            console.log(e);
            evtSrc.close();
        }

        evtSrc.onmessage = onSSEMessage;

        evtSrc.onerror = onSSEError;
        
        return () => {
            evtSrc.removeEventListener('message', onSSEMessage);
            evtSrc.removeEventListener('error', onSSEError);
            evtSrc.close();
        }
    }, []);

    return (
        <div className={styles.page}
            onClick={() => showAddFriends && setShowAddFriends(false)}
        >
            <Sidebar 
            onAddFriendClick={toggleAddFriendPopup}
            onFriendMessageClick={(friendUsername) => handleMainAreaChange(MAIN_AREA.MESSAGE_AREA, friendUsername)}
            onFriendVideoClick={(friendUsername) => handleMainAreaChange(MAIN_AREA.VIDEO_AREA, friendUsername)}
            selectedFriend={selectedFriend}
            />
            {renderMainArea()}
            {showAddFriends &&
                <AddFriendsPopup 
                onClick={onPopupClick}
                />
            }
        </div> 
    );
}
