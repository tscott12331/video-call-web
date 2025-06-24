import styles from "./message-area.module.css";
import UserInfoTopBar from "@/lib/components/user-info/user-info-top-bar";
import MessageBubble from "./message-bubble";

export default function MessageArea() {
    return (
        <section className={styles.mainSection}>
            <UserInfoTopBar />
            <div className={styles.mainMessageWrapper}>
                <MessageBubble
                type="outgoing"
                text="really long message"
                />
                <MessageBubble
                type="outgoing"
                text="really long messagesldfjsdlfja;sdjfa;sldjfasd lfja;sljfas; fj a;lskdjf ;lasjd f;lasjd f;laksjd f;laksjdf ;alskdjf a;sldkjf;aslkdjf ;alskdjf ;asdlfkj a;sdlfjk"
                />
                <MessageBubble
                type="incoming"
                text="rreally long messagesldfjsdlfja;sdjfa;sldjfasd lfja;sljfas; fj a;lskdjf ;lasjd f;lasjd f;laksjd f;laksjdf ;alskdjf a;sldkjf;aslkdjf ;alskdjf ;asdlfkj a;sdlfjkeally long message"
                />
                <MessageBubble
                type="outgoing"
                text="really long message"
                />
                <MessageBubble
                type="incoming"
                text="really long message"
                />
                <MessageBubble
                type="outgoing"
                text="really long message"
                />
                <MessageBubble
                type="outgoing"
                text="really long messagesldfjsdlfja;sdjfa;sldjfasd lfja;sljfas; fj a;lskdjf ;lasjd f;lasjd f;laksjd f;laksjdf ;alskdjf a;sldkjf;aslkdjf ;alskdjf ;asdlfkj a;sdlfjk"
                />
                <MessageBubble
                type="incoming"
                text="rreally long messagesldfjsdlfja;sdjfa;sldjfasd lfja;sljfas; fj a;lskdjf ;lasjd f;lasjd f;laksjd f;laksjdf ;alskdjf a;sldkjf;aslkdjf ;alskdjf ;asdlfkj a;sdlfjkeally long message"
                />
                <MessageBubble
                type="outgoing"
                text="really long message"
                />
                <MessageBubble
                type="incoming"
                text="really long message"
                />
                <MessageBubble
                type="outgoing"
                text="really long message"
                />
                <MessageBubble
                type="outgoing"
                text="really long messagesldfjsdlfja;sdjfa;sldjfasd lfja;sljfas; fj a;lskdjf ;lasjd f;lasjd f;laksjd f;laksjdf ;alskdjf a;sldkjf;aslkdjf ;alskdjf ;asdlfkj a;sdlfjk"
                />
                <MessageBubble
                type="incoming"
                text="rreally long messagesldfjsdlfja;sdjfa;sldjfasd lfja;sljfas; fj a;lskdjf ;lasjd f;lasjd f;laksjd f;laksjdf ;alskdjf a;sldkjf;aslkdjf ;alskdjf ;asdlfkj a;sdlfjkeally long message"
                />
                <MessageBubble
                type="outgoing"
                text="really long message"
                />
                <MessageBubble
                type="incoming"
                text="really long message"
                />
                <MessageBubble
                type="outgoing"
                text="really long message"
                />
                <MessageBubble
                type="outgoing"
                text="really long messagesldfjsdlfja;sdjfa;sldjfasd lfja;sljfas; fj a;lskdjf ;lasjd f;lasjd f;laksjd f;laksjdf ;alskdjf a;sldkjf;aslkdjf ;alskdjf ;asdlfkj a;sdlfjk"
                />
                <MessageBubble
                type="incoming"
                text="rreally long messagesldfjsdlfja;sdjfa;sldjfasd lfja;sljfas; fj a;lskdjf ;lasjd f;lasjd f;laksjd f;laksjdf ;alskdjf a;sldkjf;aslkdjf ;alskdjf ;asdlfkj a;sdlfjkeally long message"
                />
                <MessageBubble
                type="outgoing"
                text="really long message"
                />
                <MessageBubble
                type="incoming"
                text="really long message"
                />
                <MessageBubble
                type="outgoing"
                text="really long message"
                />
                <MessageBubble
                type="outgoing"
                text="really long messagesldfjsdlfja;sdjfa;sldjfasd lfja;sljfas; fj a;lskdjf ;lasjd f;lasjd f;laksjd f;laksjdf ;alskdjf a;sldkjf;aslkdjf ;alskdjf ;asdlfkj a;sdlfjk"
                />
                <MessageBubble
                type="incoming"
                text="rreally long messagesldfjsdlfja;sdjfa;sldjfasd lfja;sljfas; fj a;lskdjf ;lasjd f;lasjd f;laksjd f;laksjdf ;alskdjf a;sldkjf;aslkdjf ;alskdjf ;asdlfkj a;sdlfjkeally long message"
                />
                <MessageBubble
                type="outgoing"
                text="really long message"
                />
                <MessageBubble
                type="incoming"
                text="really long message"
                />
                <MessageBubble
                type="outgoing"
                text="really long message"
                />
                <MessageBubble
                type="outgoing"
                text="really long messagesldfjsdlfja;sdjfa;sldjfasd lfja;sljfas; fj a;lskdjf ;lasjd f;lasjd f;laksjd f;laksjdf ;alskdjf a;sldkjf;aslkdjf ;alskdjf ;asdlfkj a;sdlfjk"
                />
                <MessageBubble
                type="incoming"
                text="rreally long messagesldfjsdlfja;sdjfa;sldjfasd lfja;sljfas; fj a;lskdjf ;lasjd f;lasjd f;laksjd f;laksjdf ;alskdjf a;sldkjf;aslkdjf ;alskdjf ;asdlfkj a;sdlfjkeally long message"
                />
                <MessageBubble
                type="outgoing"
                text="really long message"
                />
                <MessageBubble
                type="incoming"
                text="really long message"
                />
            </div>
            <div className={styles.mainInputWrapper}>
                <textarea className={styles.mainMessageInput} placeholder="write a message" />
                <div className={styles.messageSendButWrapper}>
                    <button className={styles.messageSendBut}>send</button>
                </div>
            </div>
        </section>
    );
}
