import styles from "./message-area.module.css";
import MessageBubble from "./message-bubble";
import React, { useEffect, useRef, useState } from "react";
import { getCookie } from "@/lib/util/cookie";
import { TChatMessage, TRoom } from "@/app/page";
import Button from "../util/button";
import RoomInfoTopBar from "../user-info/user-info-top-bar";

interface MessageAreaProps {
    room: TRoom;
    username: string;
    onVideoClick?: () => void;
    onMessageSend?: (message: TChatMessage) => void;
    messages: TChatMessage[];
    messagesLoaded: boolean;
}

export default function MessageArea({
    room,
    onVideoClick,
    onMessageSend,
    messages,
    username,
    messagesLoaded,
}: MessageAreaProps) {
    const generatePopupText = (numMessages: number) => {
        if(numMessages > 10) {
            return "10+ new messages";
        } else if(numMessages > 0) {
            return `${numMessages} new message${numMessages !== 1 ? "s" : ""}`;
        } else {
            return "jump to latest message";
        }
    }

    const [messageText, setMessageText] = useState<string>("");
    const [showNewMessagePopup, setShowNewMessagePopup] = useState<boolean>(false);
    const [newMessages, setNewMessages] = useState<number>(0);

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
                    ChatRoomId: room.id,
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

    const handleMessageScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if(messageWrapper.current) {
            const scrollHeight = e.currentTarget.scrollHeight;
            const scrollTop = e.currentTarget.scrollTop;
            const wrapperHeight = e.currentTarget.offsetHeight;

            const shouldShowPopup = scrollHeight - (scrollTop + wrapperHeight)
              >= AUTO_SCROLL_THRESH;
            setShowNewMessagePopup(shouldShowPopup);
            if(!shouldShowPopup) {
                setNewMessages(0);
            } 
        }
    }

    const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
        messageWrapper.current?.scroll({
            behavior,
            top: messageWrapper.current.scrollHeight
        })
    }

    useEffect(() => {
        if(messagesLoaded) scrollToBottom("instant");
    }, [messagesLoaded])

    useEffect(() => {
        if(messageWrapper.current && messages.length > 0) {
            const scrollHeight = messageWrapper.current.scrollHeight;
            const scrollTop = messageWrapper.current.scrollTop;
            const wrapperHeight = messageWrapper.current.offsetHeight;
            const messageHeight = messageWrapper.current.children.item(messages.length - 1)?.clientHeight;
            
            if(messageHeight &&
                    (scrollHeight - messageHeight) -
                      (scrollTop + wrapperHeight) <
                        AUTO_SCROLL_THRESH
              ) {
                setShowNewMessagePopup(false);
                scrollToBottom();
                setNewMessages(0);
            } else {
                setShowNewMessagePopup(true);
                setNewMessages(newMessages + 1)
            }
          }

    }, [messages])

    return (
        <section className={styles.mainSection}>
            <RoomInfoTopBar 
            username={username}
            room={room}
            onControlClick={onVideoClick}
            />
            <div
                className={styles.mainMessageWrapper}
                ref={messageWrapper}
                onScroll={handleMessageScroll}
            >
                {messages?.map((message, i) => 
                    <MessageBubble
                    type={message.username === username ? "outgoing" : "incoming"}
                    text={message.content}
                    key={i}
                    />
                )}
            </div>
            {
            showNewMessagePopup &&
            <div className={styles.newMessagePopupWrapper}>
                <Button
                    onClick={() => scrollToBottom()}
                >
                    {generatePopupText(newMessages)}
                </Button>
            </div>
            }
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
