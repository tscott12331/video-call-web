"use client"

import Button from '@/lib/components/util/button';
import styles from './page.module.css';
import FriendCard from '@/lib/components/friends/friend-card';
import FriendActionButton from '@/lib/components/friends/friend-action-button';

export default function EditProfile() {
    return (
        <div
            className={styles.page}
        >
            <div className={styles.usernameCell}>
                <h2 className={styles.username}>username</h2>
                <FriendActionButton 
                    friendStatus='unadded'
            />
            </div>
            <div className={styles.pfpCell}>
                <div className={styles.pfpAndButtonWrapper}>
                    <div className={styles.pfpWrapper}></div>
                    <Button>change picture</Button>
                </div>
            </div>
            <div className={styles.homeCell}>
                <a 
                    className={styles.homeWrapper}
                    href='/'
                >
                    <img src='/home-icon.svg' />
                </a>
            </div>
            <div className={styles.bioCell}>i am a buhster, you are a buhster, we're all buhsters. at the end of the day, if you're not a buhster, you gotta go. -me</div>
            <h2 className={styles.friendsTitle}>friends</h2>
            <div className={styles.friendsCell}>
                <FriendCard
                    username="another user"
                />
                <FriendCard
                    username="another user"
                />
                <FriendCard
                    username="another user"
                />
                <FriendCard
                    username="another user"
                />
                <FriendCard
                    username="another user"
                />
                <FriendCard
                    username="another user"
                />
            </div>
        </div>
    )
}
