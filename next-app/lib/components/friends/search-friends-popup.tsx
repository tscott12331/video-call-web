import Button from '../util/button';
import FriendActionButton from './friend-action-button';
import FriendCard from './friend-card';
import styles from './search-friends-popup.module.css';
import { SimpleUser, TPopupPage } from './add-friends-popup';
import { useEffect, useState } from 'react';
import { searchFriends, searchUsers } from '@/lib/server-actions/search';
import SearchBar from '../util/search-bar';
import { friendAction } from '@/lib/server-actions/friend';

interface SearchFriendsPopupProps {
    page?: TPopupPage;
    onPageChange?: (page: TPopupPage) => void;
    onFriendClick?: (username: string) => void;
    onCancelButtonClick?: () => void;
    groupUsers?: string[];
}

export default function SearchFriendsPopup({
    page='add-friends',
    onPageChange,
    onFriendClick,
    onCancelButtonClick,
    groupUsers=[],
}: SearchFriendsPopupProps) {
    const [userList, setUserList] = useState<SimpleUser[]>([]);

    const search = async (phrase: string) => {
        try {
            let res;
            if(page === 'add-friends') {
                res = await searchUsers(phrase);
            } else {
                res = await searchFriends(phrase);
            }

            if(!res.success || res.error || !res.userList) return;
            const newUserList: SimpleUser[] = res.userList.map(user => ({
                username: user.username,
                friendStatus: page === 'create-room' ?
                                "added" :
                    user.requestIsAccepted === null ?
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

    const handleFriendAction = async (friend: SimpleUser) => {
        try {
            const res = await friendAction(friend.username);
            if(res.success) {
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
        } catch(err) {
            console.error(err);
        }
    }

    useEffect(() => {
        search('');
    }, [])


    return (
        <>
        <div className={styles.searchArea}>
            {page === 'create-room' &&
                <Button
                    onClick={() => onCancelButtonClick?.()}
                >cancel</Button>
            }
            <SearchBar
                onSearch={search}
                style={{
                    flexGrow: 1
                }}
                placeholder={`search ${page === 'create-room' ? 'your' : 'for'} friends`}
            />
            {page === 'add-friends' &&
            <Button 
                onClick={() => onPageChange?.('create-room')}
            >create room</Button>
            }
        </div>
        <div className={styles.friendArea}>
            {
            userList.filter(user => groupUsers.indexOf(user.username) === -1).map(user => 
                <FriendCard
                    username={user.username}
                    key={user.username}
                    onClick={() => onFriendClick?.(user.username)}
                >
                    {
                    page === 'add-friends' &&
                    <FriendActionButton
                        friendStatus={user.friendStatus}
                        onFriendAction={() => handleFriendAction(user)}
                    />
                    }
                </FriendCard>
            )
            }
        </div>
        </>

    )
}
