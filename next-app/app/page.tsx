import styles from "./page.module.css";
import Sidebar from "@/lib/components/sidebar/sidebar";
import MessageArea from "@/lib/components/messaging/message-area";
import VideoArea from "@/lib/components/video/video-area";


export default function Home() {
  return (
    <div className={styles.page}>
        <Sidebar />
        <VideoArea />
    </div> 
  );
}
