import styles from "./sidebar.module.css";

export default function Sidebar() {
    return (
        <section className={styles.sbSection}>
            <div className={styles.sbCtrls}>
                <div className={styles.sbCtrlsTop}>
                    <div className={styles.pfpWrapper}></div>
                    <div className={styles.addFriendWrapper}></div>
                </div>
                <div className={styles.sbSearchWrapper}>
                    <input placeholder="search friends" className={styles.sbSearch} />
                    <button className={styles.sbSearchBut}>search</button>
                </div>
            </div>
            <div className={styles.sbFriendsList}></div>
        </section>
    );
}
