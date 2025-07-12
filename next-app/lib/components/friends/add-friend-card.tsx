import { friendAction } from "@/lib/server-actions/friend";
import Button from "../util/button";
import styles from './add-friend-card.module.css';
import { SimpleUser } from "./add-friends-popup";

interface AddFriendCardProps {
    username: string,
    friendStatus: 'unadded' | 'pending' | 'added',
    onFriendAction?: (friend: SimpleUser, success: boolean) => void;
};

export default function AddFriendCard({
    username,
    friendStatus,
    onFriendAction,
}: AddFriendCardProps) {

    const handleFriendAction = async () => {
        try {
            const res = await friendAction(username);
            if(res.success) {
                onFriendAction?.({username, friendStatus}, true);
            } else {
                onFriendAction?.({username, friendStatus}, false);
            }
        } catch(err) {
            console.error(err);
            onFriendAction?.({username, friendStatus}, false);
        }
    }
    return (
        <div className={styles.friendWrapper}
            key={username}
        >
            <div className={styles.friendWrapperLeft}>
                <div className={styles.pfpIconWrapper}></div>
                <p className={styles.friendUsername}>{username}</p>
            </div>
            <Button
            onClick={() => handleFriendAction()}
            >
                <img src={friendStatus === "unadded" ?
                            '/plus.svg' :
                            friendStatus === "pending" ?
                            '/pending.svg' :
                            '/added.svg' } />
            </Button>
        </div>
    )
}
