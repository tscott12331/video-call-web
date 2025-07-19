"use client"

import Button from '@/lib/components/util/button';
import styles from './page.module.css';
import FriendCard from '@/lib/components/friends/friend-card';
import FriendActionButton from '@/lib/components/friends/friend-action-button';
import { useEffect, useState } from 'react';
import { getPfp, setPfp } from '@/lib/server-actions/image';
import { getUserProfile, updateUserProfile } from '@/lib/server-actions/user';

type TProfileObj = {
    Username: string;
    UserBio: string;
    CreatedAt: Date | null;
    UpdatedAt: Date | null;
}

export default function EditProfile() {
    const [isEditingBio, setIsEditingBio] = useState<boolean>(false);
    const [pfpSrc, setPfpSrc] = useState<string>("/added.svg");
    const [profileObj, setProfileObj] = useState<TProfileObj>({
        Username: "",
        UserBio: "",
        CreatedAt: null,
        UpdatedAt: null,
    });

    const handleBioEditToggle = async () => {
        if(isEditingBio) {
            try {
                await updateUserProfile({ UserBio: profileObj.UserBio });
                setIsEditingBio(false);
            } catch(err) {
                console.error(err);
            }
        } else {
            setIsEditingBio(true);
        }
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

    const initializePfp = async () => {
        try {
            const res = await getPfp();
            if(!res.success || res.error || !res.file) return;

            const url = URL.createObjectURL(res.file);
            setPfpSrc(url);
        } catch(err) {
            console.error(err);
        }
    }

    const initializeUserProfile = async () => {
        try {
            initializePfp();

            const res = await getUserProfile();
            if(res.error || !res.success || !res.userProfile) return;

            setProfileObj(res.userProfile);
        } catch(err) {
            console.error(err);
        }
    }

    useEffect(() => {
        initializeUserProfile();
    }, [])

    return (
        <div
            className={styles.page}
        >
            <div className={styles.usernameCell}>
                <h2 className={styles.username}>{profileObj.Username}</h2>
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
                    defaultValue={profileObj.UserBio} 
                    className={styles.bioEdit}
                    onKeyDown={handleBioKeyDown}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                        setProfileObj({...profileObj, UserBio: e.currentTarget.value})}
                ></textarea>
                :
                <p className={styles.bio}>{profileObj.UserBio}</p>
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
