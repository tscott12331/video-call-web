import styles from "./message-area.module.css";
import UserInfoTopBar from "@/lib/components/user-info/user-info-top-bar";
import MessageBubble from "./message-bubble";
import React, { useEffect, useRef, useState } from "react";
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
    const messageWrapper = useRef<HTMLDivElement>(null);

    const AUTO_SCROLL_THRESH = 200; //px

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

            setMessageText("");

            onMessageSend?.(newMessage);
        } catch(err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if(messages && messageWrapper.current) {
            const scrollHeight = messageWrapper.current.scrollHeight;
            const scrollTop = messageWrapper.current.scrollTop;
            const wrapperHeight = messageWrapper.current.offsetHeight;
            const messageHeight = messageWrapper.current.children.item(messages.length - 1)?.clientHeight;
            
            if(messageHeight &&
                    (scrollHeight - messageHeight) -
                      (scrollTop + wrapperHeight) <
                        AUTO_SCROLL_THRESH
              ) {
                messageWrapper.current?.scroll({
                    behavior: "smooth",
                    top: messageWrapper.current.scrollHeight
                })
            }
          }
    }, [messages])

    //useEffect(() => {
    //    const onLeScroll = () => {
    //        if(messages && messageWrapper.current) {
    //            const scrollHeight = messageWrapper.current.scrollHeight;
    //            const scrollTop = messageWrapper.current.scrollTop;
    //            const wrapperHeight = messageWrapper.current.offsetHeight;
    //            const messageHeight = messageWrapper.current.children.item(messages.length - 1)?.clientHeight;
    //            console.log(messages.length);
    //            //console.log(messageWrapper.current.children.item(0))
    //            if(messageHeight) {
    //                console.log((scrollHeight - messageHeight) -
    //                  (scrollTop + wrapperHeight));
    //            }
    //        }
    //    }
    //    messageWrapper.current?.addEventListener('scroll', onLeScroll);
    //
    //    return () => messageWrapper.current?.removeEventListener('scroll', onLeScroll);
    //}, [])

    return (
        <section className={styles.mainSection}>
            <UserInfoTopBar 
            username={friend.username}
            onControlClick={onVideoClick}
            />
            <div
                className={styles.mainMessageWrapper}
                ref={messageWrapper}
            >
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
                value={messageText}
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
