"use server";
import { db } from "../db/db";
import { UserFriendTable, UserProfileTable } from "../db/schemas/user";
import { and, eq, isNotNull, not, or } from "drizzle-orm";
import { authenticateUser } from "./auth";
import { ChatRoomTable, UserProfile_ChatRoom } from "../db/schemas/chat";
import { TFriend, TRoom } from "@/app/page";

export async function friendAction(friendUsername: string) {
    try {
        const authRes = await authenticateUser();
        if(!authRes.success || !authRes.username) return { 
            error: authRes.error,
            success: false,
        };

        const { username } = authRes;
        const existingRelationship = await db.select({
            username: UserFriendTable.UserProfile_Username,
            addedUsername: UserFriendTable.AddedProfile_Username,
            isAccepted: UserFriendTable.IsAccepted,
        }).from(UserFriendTable)
            .where(or(
                and(
                    eq(UserFriendTable.UserProfile_Username, username),
                    eq(UserFriendTable.AddedProfile_Username, friendUsername)
                ),
                and(
                    eq(UserFriendTable.UserProfile_Username, friendUsername),
                    eq(UserFriendTable.AddedProfile_Username, username)
                )
            ));
        console.log(existingRelationship);

        if(existingRelationship.length === 0) {
            // no existing relationship
            return await addFriend(friendUsername);
        }

        const relationship = existingRelationship[0];
        if(relationship.username === friendUsername) {
            // friendUsername made the request
            if(!relationship.isAccepted) {
                // accept request
                return await acceptFriend(friendUsername);
            } else {
                return { 
                    error: "Friend request already accepted",
                    success: false,
                };
            }
        } else {// if(relationship.username === username) { // just to be verbose
            // we made the request, return error
            return { 
                error: "Request already made",
                success: false,
            };
        }
    } catch(err) {
        console.error(err);
        return { 
            error: "Server error",
            success: false,
        };
    }
}

export async function addFriend(friendUsername: string) {
    if(!friendUsername) return { 
        error: "Not a valid user to add",
        success: false,
    };
    try {
        const authRes = await authenticateUser();
        if(!authRes.success || !authRes.username) return { 
            error: authRes.error,
            success: false,
        };

        const { username } = authRes;
        await db.insert(UserFriendTable).values({
            UserProfile_Username: username,
            AddedProfile_Username: friendUsername,
            IsAccepted: false,
        })

        return { success: true };

    } catch(err) {
        console.error(err);
        return { 
            error: "Server error",
            success: false,
        };
    }
}

export async function acceptFriend(friendUsername: string) {
    try {
        const authRes = await authenticateUser();
        if(!authRes.success || !authRes.username) return { 
            error: authRes.error,
            success: false,
        };

        const { username } = authRes;

        const friendRoomId = (await db.insert(ChatRoomTable).values({
                        ChatRoomName: `${friendUsername}, ${username}`
                    })
                    .returning({ id: ChatRoomTable.ChatRoomId }))[0].id;

        await db.insert(UserProfile_ChatRoom).values([
            {
                Username: username,
                ChatRoomId: friendRoomId,
            },
            {
                Username: friendUsername,
                ChatRoomId: friendRoomId,
            }
        ]);

        await db.update(UserFriendTable).set({
            IsAccepted: true,
            ChatRoomId: friendRoomId,
        }).where(and(
            eq(UserFriendTable.UserProfile_Username, friendUsername),
            eq(UserFriendTable.AddedProfile_Username, username)
        ))

        return { success: true } 
    } catch(err) {
        console.error(err);
        return { 
            error: "Server error",
            success: false,
        };
    }
}

export async function removeFriend(friendUsername: string) {

}

export async function getRooms(limit: number = 10, offset: number = 0) {
    try {
        const authRes = await authenticateUser();
        if(!authRes.success || !authRes.username) return { 
            error: authRes.error,
            success: false,
        };

        const { username } = authRes;

        const rooms: TRoom[] = await db.select({
                        id: UserProfile_ChatRoom.ChatRoomId,
                        name: ChatRoomTable.ChatRoomName,
                    })
                    .from(UserProfile_ChatRoom)
                    .innerJoin(ChatRoomTable,
                        eq(UserProfile_ChatRoom.ChatRoomId, ChatRoomTable.ChatRoomId)
                    )
                    .where(
                        eq(UserProfile_ChatRoom.Username, username)
                    )
                    .limit(limit)
                    .offset(offset);

        console.log(rooms);

        return {
            success: true,
            rooms
        }
    } catch(err) {
        console.error(err);
        return {
            error: "Server error",
            success: false,
        }
    }

}

export async function getFriends(limit: number = 10, offset: number = 0) {
    try {
        const authRes = await authenticateUser();
        if(!authRes.success || !authRes.username) return { 
            error: authRes.error,
            success: false,
        };

        const { username } = authRes;

        const friendList: TFriend[] = await db.select({
            username: UserProfileTable.Username,
            roomId: UserFriendTable.ChatRoomId,
        })
            .from(UserProfileTable)
            .innerJoin(UserFriendTable,
                        or(
                            eq(UserProfileTable.Username, UserFriendTable.UserProfile_Username),
                            eq(UserProfileTable.Username, UserFriendTable.AddedProfile_Username)
                        )
                      )
            .where(
                and(
                    or(
                        eq(UserFriendTable.UserProfile_Username, username),
                        eq(UserFriendTable.AddedProfile_Username, username)
                    )
                    ,
                    eq(UserFriendTable.IsAccepted, true),
                    not(eq(UserProfileTable.Username, username)),
                    isNotNull(UserFriendTable.ChatRoomId)
                )
            )
            .limit(limit)
            .offset(offset);

            return {
                success: true,
                friendList,
            }
    } catch(err) {
        console.error(err);
        return { 
            error: "Server error",
            success: false,
        };
    }
}
