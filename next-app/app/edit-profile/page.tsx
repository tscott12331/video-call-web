"use client"

import Button from '@/lib/components/util/button';
import styles from './page.module.css';
import FriendCard from '@/lib/components/friends/friend-card';
import FriendActionButton from '@/lib/components/friends/friend-action-button';
import { useEffect, useState } from 'react';
import { getPfp, setPfp } from '@/lib/server-actions/image';

export default function EditProfile() {
    const [isEditingBio, setIsEditingBio] = useState<boolean>(false);
    const [bioText, setBioText] = useState<string>("");
    const [pfpSrc, setPfpSrc] = useState<string>("/added.svg");

    const handleBioEditToggle = () => {
        setIsEditingBio(!isEditingBio);
    }

    const handleBioKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(e.key === 'Enter') {
            handleBioEditToggle();
            return;
        }
    }

    const handlePfpUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!e.currentTarget.files || e.currentTarget.files.length === 0) return;

        const image = e.currentTarget.files[0];
        const res = await setPfp(image);
        if(res.success) {
            setPfpSrc(URL.createObjectURL(image));
        }

    }

    const retrieveInitialPfp = async () => {
        try {
            const res = await getPfp();
            if(!res.success || res.error || !res.file) return;

            console.log(res.file);

            const url = URL.createObjectURL(res.file);
            setPfpSrc(url);
        } catch(err) {
            console.error(err);
        }
    }

    useEffect(() => {
        retrieveInitialPfp();
    }, [])

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
                    <div className={styles.pfpWrapper}>
                        <img src={pfpSrc} />
                    </div>
                    <label 
                        htmlFor="pfp-input"
                    >change picture</label>
                    <input 
                        type='file' 
                        name="pfp-input"
                        id="pfp-input"
                        onChange={handlePfpUpload}
                        accept="image/png, image/jpeg"
                        style={{display: "none"}}
                    />
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
