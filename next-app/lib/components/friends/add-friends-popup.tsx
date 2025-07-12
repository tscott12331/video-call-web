import { searchUsers } from '@/lib/server-actions/search';
import Button from '../util/button';
import styles from './add-friends-popup.module.css';
import { useEffect, useState } from 'react';
import AddFriendCard from './add-friend-card';

export type SimpleUser = {
    username: string;
    friendStatus: "unadded" | "pending" | "added";
}

type TPopupPage = 'add-friends' | 'create-room';

export default function AddFriendsPopup({ ...rest }: React.HTMLProps<HTMLDivElement>) {
    const [userList, setUserList] = useState<SimpleUser[]>([]);
    const [searchPhrase, setSearchPhrase] = useState<string>("");
    const [page, setPage] = useState<TPopupPage>("add-friends");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setSearchPhrase(e.target.value);
    }

    const handleSearchKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') {
            handleSearch();
        }
    }

    const handleSearch = () => {
        const trimmedPhrase = searchPhrase.trim();
        if(trimmedPhrase.length === 0) return;
        search(trimmedPhrase)
    }

    const search = async (phrase: string) => {
        try {
            const list = await searchUsers(phrase);
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

    const handleFriendAction = async (friend: SimpleUser, success: boolean) => {
        if(success) {
                const userIndex = userList.indexOf(friend);
                if(userIndex === -1) return;
                const nextStatus = friend.friendStatus === "unadded" ?
                                    "pending" :
                                    "added";
                setUserList([...userList.slice(0, userIndex), 
                            { username: friend.username,
                            friendStatus: nextStatus },
                            ...userList.slice(userIndex + 1, userList.length)]);
        }
    }

    useEffect(() => {
        search("");
    }, [])

    return (
        <div className={styles.wrapper} {...rest}>
        {
            page === 'add-friends' ?
            <>
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
                <Button onClick={() => setPage('create-room')}>create room</Button>
            </div>
            <div className={styles.friendArea}>
                {
                userList.map(user => 
                    <AddFriendCard
                        username={user.username}
                        friendStatus={user.friendStatus}
                        onFriendAction={handleFriendAction}
                        key={user.username}
                    />
                )
                }
            </div>
            </>
            : 
            <>
            <div className={styles.createGroupWrapper}>
                <div className={styles.createGroupTop}>
                    <div className={styles.backButtonCell}>
                        <Button
                        className={styles.backButton}
                        onClick={() => setPage('add-friends')}
                        >
                            <img src='/arrow-left.svg' />
                        </Button>
                    </div>
                    <div className={styles.titleCell}>
                        <h3>create group</h3>
                    </div>
                </div>
                <div className={styles.groupPfpCell}>
                    <div className={styles.groupPfpWrapper}></div>
                    <Button className={styles.changeGroupPfpButton}>
                        change picture
                    </Button>
                </div>
                <div className={styles.nameInputCell}>
                    <input placeholder="group name"/>
                </div>
                <div className={styles.addFriendCell}>
                    <AddFriendCard
                        username="you"
                        friendStatus="added"
                    />
                    <AddFriendCard
                        username="you"
                        friendStatus="added"
                    />
                    <AddFriendCard
                        username="you"
                        friendStatus="added"
                    />
                    <AddFriendCard
                        username="you"
                        friendStatus="added"
                    />
                    <AddFriendCard
                        username="you"
                        friendStatus="added"
                    />
                    <AddFriendCard
                        username="you"
                        friendStatus="added"
                    />
                    <AddFriendCard
                        username="you"
                        friendStatus="added"
                    />
                    <AddFriendCard
                        username="you"
                        friendStatus="added"
                    />
                </div>
            </div>
            </>
        }
        </div>
    )
}
