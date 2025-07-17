"use client"

import Button from '@/lib/components/util/button';
import styles from './page.module.css';
import FriendCard from '@/lib/components/friends/friend-card';
import FriendActionButton from '@/lib/components/friends/friend-action-button';
import { useState } from 'react';

export default function EditProfile() {
    const [isEditingBio, setIsEditingBio] = useState<boolean>(false);
    const [bioText, setBioText] = useState<string>("");

    const handleBioEditToggle = () => {
        setIsEditingBio(!isEditingBio);
    }

    const handleBioKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(e.key === 'Enter') {
            handleBioEditToggle();
            return;
        }
    }

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
            <div className={styles.bioCell}>
                {isEditingBio ?
                <textarea 
                    defaultValue={bioText} 
                    className={styles.bioEdit}
                    onKeyDown={handleBioKeyDown}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBioText(e.currentTarget.value)}
                ></textarea>
                :
                <p className={styles.bio}>{bioText}</p>
                }
                <Button
                    onClick={handleBioEditToggle}
                >
                {isEditingBio ? 
                    "done"
                :
                    "edit"
                }
                </Button>
            </div>
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
