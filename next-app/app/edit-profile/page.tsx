"use client"

import styles from './page.module.css';
import FriendCard from '@/lib/components/friends/friend-card';
import { useEffect, useRef, useState } from 'react';
import { getPfp, setPfp } from '@/lib/server-actions/image';
import { getUserProfile, updateUserProfile } from '@/lib/server-actions/user';
import { TFriend } from '../page';
import { getFriends } from '@/lib/server-actions/friend';
import Button from '@/lib/components/util/button';

type TProfileObj = {
    Username: string;
    UserBio: string;
    CreatedAt: Date | null;
    UpdatedAt: Date | null;
}

export default function EditProfile() {
    const bioRef = useRef<HTMLTableCellElement>(null);
    const [friendsList, setFriendsList] = useState<TFriend[]>([]);
    const [pfpSrc, setPfpSrc] = useState<string|undefined>(undefined);
    const [profileObj, setProfileObj] = useState<TProfileObj>({
        Username: "",
        UserBio: "",
        CreatedAt: null,
        UpdatedAt: null,
    });

    const handleBioSave = async () => {
        try {
            await updateUserProfile({ UserBio: profileObj.UserBio });
        } catch(err) {
            console.error(err);
        }
    }

    const handleBioKeyDown = (e: React.KeyboardEvent<HTMLTableCellElement>) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            bioRef.current?.blur();
            handleBioSave();
            return;
        }
    }

    const handleBioChange = (e: React.InputEvent<HTMLTableCellElement>) => {
        if(bioRef.current) {
            setProfileObj({...profileObj, UserBio: bioRef.current.textContent ?? ""})
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
            if(bioRef.current) bioRef.current.textContent = res.userProfile.UserBio;
        } catch(err) {
            console.error(err);
        }
    }

    const fetchUserData = async () => {
        try {
            await initializeUserProfile();
            const res = await getFriends();
            if(res.error || !res.success || !res.friendList) return;

            setFriendsList(res.friendList);
        } catch(err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchUserData();
    }, [])

    return (
        <div
            className={styles.page}
        >
            <div className={styles.usernameCell}>
                <h2 className={styles.username}>{profileObj.Username}</h2>
            </div>
            <div className={styles.pfpCell}>
                <div className={styles.pfpAndButtonWrapper}>
                    <div className={styles.pfpWrapper}>
                        <img src={pfpSrc} alt="loading" />
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
            <table className={styles.bioCell}>
                <tbody>
                    <tr>
                        <td 
                            valign="middle"
                            className={styles.bio}
                            contentEditable="true"
                            onKeyDown={handleBioKeyDown}
                            onInput={handleBioChange}
                            ref={bioRef}
                            onBlur={handleBioSave}
                        ></td>
                        <td>
                            <Button
                                style={{visibility: 'hidden'}}
                            >change picture</Button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <h2 className={styles.friendsTitle}>friends</h2>
            <div className={styles.friendsCell}>
                {friendsList.map(friend => 
                    <FriendCard
                        username={friend.username}
                        key={friend.username}
                    />
                )}
            </div>
        </div>
    )
}
