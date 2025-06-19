import { searchUsers } from '@/lib/server-actions/search';
import Button from '../util/button';
import styles from './add-friends-popup.module.css';
import { useState } from 'react';

type SimpleUser = {
    username: string;
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
        setUserList(await searchUsers(searchPhrase));
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
                        <Button>
                            <img src='/plus.svg' />
                        </Button>
                    </div>
                )
                }
            </div>
        </div>
    )
}
