import { searchUsers } from '@/lib/server-actions/search';
import Button from '../util/button';
import styles from './add-friends-popup.module.css';
import { useState } from 'react';
import { friendAction } from '@/lib/server-actions/friend';

type SimpleUser = {
    username: string;
    friendStatus: "unadded" | "pending" | "added";
}

export default function AddFriendsPopup() {
    const [userList, setUserList] = useState<SimpleUser[]>([]);
    const [searchPhrase, setSearchPhrase] = useState<string>("");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setSearchPhrase(e.target.value);
    }

    const handleSearchKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') {
            handleSearch();
        }
    }

    const handleSearch = async () => {
        try {
            const list = await searchUsers(searchPhrase);
            const newUserList: SimpleUser[] = list.map(user => ({
                username: user.username,
                friendStatus: user.requestIsAccepted === null ?
                                "unadded" :
                                user.requestIsAccepted ?
                                "added" :
                                "pending"
            }))
            setUserList(newUserList);
        } catch(err) {
            console.error(err);
        }
    }

    const handleFriendAction = async (friendUsername: string) => {
        try {
            console.log(await friendAction(friendUsername));
        } catch(err) {
            console.error(err);
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.searchArea}>
                <div className={styles.searchWrapper}>
                    <input placeholder="search for friends" 
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchKeydown}
                    />
                    <Button
                        onClick={handleSearch}
                    >
                        <img src='/search-symbol.svg' />
                    </Button>
                </div>
            </div>
            <div className={styles.friendArea}>
                {
                userList.map(user => 
                    <div className={styles.friendWrapper}
                    key={user.username}
                    >
                        <div className={styles.friendWrapperLeft}>
                            <div className={styles.pfpIconWrapper}></div>
                            <p className={styles.friendUsername}>{user.username}</p>
                        </div>
                        <Button
                        onClick={() => handleFriendAction(user.username)}
                        >
                            <img src={user.friendStatus === "unadded" ?
                                        '/plus.svg' :
                                        user.friendStatus === "pending" ?
                                        '/pending.svg' :
                                        '/added.svg' } />
                        </Button>
                    </div>
                )
                }
            </div>
        </div>
    )
}
