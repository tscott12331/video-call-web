import styles from "./page.module.css";
import Sidebar from "@/components/sidebar/sidebar";
import MessageArea from "@/components/messaging/message-area";


export default function Home() {
  return (
    <div className={styles.page}>
        <Sidebar />
        <MessageArea />
    </div>
  );
}
