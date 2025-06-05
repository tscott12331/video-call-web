import styles from "./message-area.module.css";

export default function MessageArea() {
    return (
        <section className={styles.mainSection}>
            <div className={styles.mainInfoWrapper}>
                <div className={styles.mainIconTextWrapper}>
                    <div className={styles.pfpBigIcon}></div>
                    <p className={styles.infoUsername}>User Name</p>
                </div>
                <div className={styles.videoBigIcon}></div>
            </div>
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
