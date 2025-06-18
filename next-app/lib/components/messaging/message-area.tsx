import styles from "./message-area.module.css";
import UserInfoTopBar from "@/lib/components/user-info/user-info-top-bar";

export default function MessageArea() {
    return (
        <section className={styles.mainSection}>
            <UserInfoTopBar />
            <div className={styles.mainMessageWrapper}></div>
            <div className={styles.mainInputWrapper}>
                <textarea className={styles.mainMessageInput} placeholder="write a message" />
                <div className={styles.messageSendButWrapper}>
                    <button className={styles.messageSendBut}>send</button>
                </div>
            </div>
        </section>
    );
}
