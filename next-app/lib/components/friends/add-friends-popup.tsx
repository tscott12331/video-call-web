import Button from '../util/button';
import styles from './add-friends-popup.module.css';
import { useEffect, useState } from 'react';
import FriendCard from './friend-card';
import SearchFriendsPopup from './search-friends-popup';
import BackButton from '../util/back-button';
import FriendActionButton from './friend-action-button';

export type SimpleUser = {
    username: string;
    friendStatus: "unadded" | "pending" | "added";
}

export type TPopupPage = 'add-friends' | 'create-room';

export default function AddFriendsPopup({ ...rest }: React.HTMLProps<HTMLDivElement>) {
    const [page, setPage] = useState<TPopupPage>("add-friends");
    const [showFriendSearch, setShowFriendSearch] = useState<boolean>(false);
    const [groupUsers, setGroupUsers] = useState<string[]>([]);

    const handleFriendClick = (username: string) => {
        if(page === 'create-room') {
            setShowFriendSearch(false);
            if(groupUsers.indexOf(username) !== -1) return
            
            setGroupUsers([...groupUsers, username]);
        }
        
    }

    const removeFromGroup = (user: string) => {
        const index = groupUsers.indexOf(user);
        if(index === -1) return;

        let newGroup = [...groupUsers];
        newGroup.splice(index, 1);

        setGroupUsers([...newGroup]);

    }

    useEffect(() => {
        setGroupUsers([]);
    }, [page])

    return (
        <div className={styles.wrapper} {...rest}>
        {
            page === 'add-friends' ?
            <SearchFriendsPopup
                page={page}
                onPageChange={(p) => setPage(p)}
            />
            : 
            showFriendSearch ?
            <SearchFriendsPopup
                page={page}
                onPageChange={(p) => setPage(p)}
                onCancelButtonClick={() => setShowFriendSearch(false)}
                onFriendClick={handleFriendClick}
                groupUsers={groupUsers}
            />
            :
            <>
            <div className={styles.createGroupWrapper}>
                <div className={styles.createGroupTop}>
                    <div className={styles.backButtonCell}>
                        <BackButton
                        onClick={() => setPage('add-friends')}
                        />
                    </div>
                    <div className={styles.titleCell}>
                        <h3>create group</h3>
                    </div>
                    <div className={styles.createButtonCell}>
                        <Button>
                        create
                        </Button>
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
                    <FriendCard
                        username="you"
                    />
                    {
                        groupUsers.map(user => 
                        <FriendCard
                            username={user}
                            key={user}
                        >
                            <FriendActionButton
                                remove={true}
                                friendStatus="added"
                                onFriendAction={() => removeFromGroup(user)}
                            />
                        </FriendCard>
                        )
                    }
                    <div className={styles.groupAddWrapper}>
                        <Button
                            onClick={() => setShowFriendSearch(true)}
                        >
                            <img src='plus.svg' />
                        </Button>
                    </div>
                </div>
            </div>
            </>
        }
        </div>
    )
}
