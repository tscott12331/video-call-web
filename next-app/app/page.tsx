"use client"

import styles from "./page.module.css";
import Sidebar from "@/lib/components/sidebar/sidebar";
import MessageArea from "@/lib/components/messaging/message-area";
import VideoArea from "@/lib/components/video/video-area";
import AddFriendsPopup from "@/lib/components/friends/add-friends-popup";
import { useEffect, useState } from "react";
import { SSE_URL } from "@/endpoints";
import { authenticateUser } from "@/lib/server-actions/auth";
import { getChatMessages } from "@/lib/server-actions/chat";

enum MAIN_AREA {
    NONE,
    MESSAGE_AREA,
    MESSAGE_AREA_NO_USER,
    VIDEO_AREA,
    VIDEO_AREA_NO_USER,
}

export type TChatMessage = {
    messageId: string;
    roomId: string | null;
    username: string,
    content: string,
    chatTime: Date;
}


export type TFriend = {
    username: string;
}

export type TRoom = {
    name: string,
    id: string,
}

export default function Home() {
    const [showAddFriends, setShowAddFriends] = useState<boolean>(false);
    const [mainArea, setMainArea] = useState<MAIN_AREA>(MAIN_AREA.NONE);
    const [messages, setMessages] = useState<TChatMessage[]>([]);
    const [messagesLoaded, setMessagesLoaded] = useState<boolean>(false);
    const [newestMessage, setNewestMessage] = useState<TChatMessage>();
    const [selectedRoom, setSelectedRoom] = useState<TRoom|null|undefined>();
    const [loggedInUser, setLoggedInUser] = useState<string|undefined|null>();
    const toggleAddFriendPopup = () => {
        setShowAddFriends(!showAddFriends);
    }

    const onPopupClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation();
    }

    const handleMainAreaChange = (areaType: MAIN_AREA, room: TRoom) => {
        setMainArea(areaType);
        setSelectedRoom(room);
        setMessagesLoaded(false);
    }

    const renderMainArea = () => {
        switch(mainArea) {
            case MAIN_AREA.MESSAGE_AREA_NO_USER:
            case MAIN_AREA.VIDEO_AREA_NO_USER:
            case MAIN_AREA.NONE:
                return <p>nada</p>;
            case MAIN_AREA.MESSAGE_AREA:
                if(!selectedRoom || !loggedInUser) {
                    setMainArea(MAIN_AREA.MESSAGE_AREA_NO_USER);
                    return;
                }
                return <MessageArea 
                room={selectedRoom}
                username={loggedInUser}
                messages={messages}
                messagesLoaded={messagesLoaded}
                onMessageSend={(message: TChatMessage) => appendMessage(message)}
                onVideoClick={() => handleMainAreaChange(MAIN_AREA.VIDEO_AREA, selectedRoom)}
                />
            case MAIN_AREA.VIDEO_AREA:
                if(!selectedRoom) {
                    setMainArea(MAIN_AREA.VIDEO_AREA_NO_USER);
                    return;
                }
                return <VideoArea 
                room={selectedRoom} 
                onMessageClick={() => handleMainAreaChange(MAIN_AREA.MESSAGE_AREA, selectedRoom)}
                />
        }
    }

    const setCurrentUser = async () => {
        const res = await authenticateUser()
        if(!res.success || res.error) {
            setLoggedInUser(undefined);
        } else if(res.success) {
            setLoggedInUser(res.username);
        }
    }

    const appendMessage = (message: TChatMessage) => {
        const newMessages = [...messages, message];
        setMessages(newMessages);
    }

    const initializeChatMessages = async () => {
        if(!selectedRoom) return;
        const res = await getChatMessages(selectedRoom.id)
        if(!res.success) {
            console.log(res.error);
        } else if(res.messages) {
            setMessages(res.messages)
            setMessagesLoaded(true);
        }

    }

    useEffect(() => {
        setCurrentUser();
    }, [])

    useEffect(() => {
        if(newestMessage === undefined) return;
        appendMessage(newestMessage);
    }, [newestMessage])

    useEffect(() => {
        initializeChatMessages();

        const evtSrc = new EventSource(`${SSE_URL}/chat-listen`, {
            withCredentials: true
        });

        const onSSEMessage = (e: MessageEvent) => {
            console.log(e);
            if(!e.data) return;

            const data = JSON.parse(e.data);
            if(!data.username || !data.content || !data.roomId
               || !data.messageId || !data.chatTime) return;
            
            if(data.roomId === selectedRoom?.id) {
                setNewestMessage({
                    username: data.username,
                    content: data.content,
                    chatTime: data.chatTime,
                    roomId: data.roomId,
                    messageId: data.messageId,
                })
            }

        }

        const onSSEError = (e: Event) => {
            console.log(e);
            evtSrc.close();
        }

        evtSrc.addEventListener('chat-message', onSSEMessage);

        evtSrc.onerror = onSSEError;
        
        return () => {
            evtSrc.removeEventListener('chat-message', onSSEMessage);
            evtSrc.removeEventListener('error', onSSEError);
            evtSrc.close();
        }
    }, [selectedRoom]);

    return (
        <div className={styles.page}
            onClick={() => showAddFriends && setShowAddFriends(false)}
        >
            <Sidebar 
            onAddFriendClick={toggleAddFriendPopup}
            onFriendMessageClick={(room) => handleMainAreaChange(MAIN_AREA.MESSAGE_AREA, room)}
            onFriendVideoClick={(room) => handleMainAreaChange(MAIN_AREA.VIDEO_AREA, room)}
            selectedRoom={selectedRoom}
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
