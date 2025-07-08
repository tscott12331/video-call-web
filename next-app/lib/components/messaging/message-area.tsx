import styles from "./message-area.module.css";
import UserInfoTopBar from "@/lib/components/user-info/user-info-top-bar";
import MessageBubble from "./message-bubble";
import { useState } from "react";
import { Friend } from "../sidebar/sidebar";
import { getCookie } from "@/lib/util/cookie";
import { TChatMessage } from "@/app/page";
import { ChatMessage } from "@/lib/db/schemas/chat";

interface MessageAreaProps {
    friend: Friend;
    username: string;
    onVideoClick?: () => void;
    onMessageSend?: (message: TChatMessage) => void;
    messages?: TChatMessage[];
}

export default function MessageArea({
    friend,
    onVideoClick,
    onMessageSend,
    messages,
    username,
}: MessageAreaProps) {
    const [messageText, setMessageText] = useState<string>("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    }

    const sendMessage = async () => {
        try {
            const token = getCookie('token');
            if(!token) return;
            const res = await fetch("http://localhost:5000/send-message", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Bearer': token,
                },
                body: JSON.stringify({
                    Content: messageText,
                    ChatRoomId: friend.roomId,
                }),
            })

            if(!res.ok) return;
            const newMessage: TChatMessage = await res.json();

            onMessageSend?.(newMessage);
        } catch(err) {
            console.error(err);
        }
    }

    return (
        <section className={styles.mainSection}>
            <UserInfoTopBar 
            username={friend.username}
            onControlClick={onVideoClick}
            />
            <div className={styles.mainMessageWrapper}>
                {messages?.map((message, i) => 
                    <MessageBubble
                    type={message.username === username ? "outgoing" : "incoming"}
                    text={message.content}
                    key={i}
                    />
                )}
            </div>
            <div className={styles.mainInputWrapper}>
                <textarea 
                className={styles.mainMessageInput} 
                placeholder="write a message" 
                onKeyDown={handleKeyDown}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessageText(e.currentTarget.value)}
                />
                <div className={styles.messageSendButWrapper}>
                    <button 
                    className={styles.messageSendBut}
                    onClick={sendMessage}
                    >send</button>
                </div>
            </div>
        </section>
    );
}
