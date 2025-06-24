"use server";

import { cookies } from "next/headers";
import { db } from "../db/db";
import { UserFriendTable, UserProfileTable } from "../db/schemas/user";
import { verifyJWT } from "../auth/jwt";
import { and, eq, not, or } from "drizzle-orm";
import { authenticateUser } from "./auth";

export async function friendAction(friendUsername: string) {
    try {
        const authRes = await authenticateUser();
        if(!authRes.success) return { error: authRes.error };

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
                return { error: "Friend request already accepted" };
            }
        } else {// if(relationship.username === username) { // just to be verbose
            // we made the request, return error
            return { error: "Request already made" };
        }
    } catch(err) {
        console.error(err);
        return { error: "Server error" };
    }
}

export async function addFriend(friendUsername: string) {
    if(!friendUsername) return { error: "Not a valid user to add" };
    try {
        const authRes = await authenticateUser();
        if(!authRes.success) return { error: authRes.error };

        const { username } = authRes;
        await db.insert(UserFriendTable).values({
            UserProfile_Username: username,
            AddedProfile_Username: friendUsername,
            IsAccepted: false,
        })

        return { success: true };

    } catch(err) {
        console.error(err);
        return { error: "Server error" };
    }
}

export async function acceptFriend(friendUsername: string) {
    try {
        const authRes = await authenticateUser();
        if(!authRes.success) return { error: authRes.error };

        const { username } = authRes;

        await db.update(UserFriendTable).set({
            IsAccepted: true
        }).where(and(
            eq(UserFriendTable.UserProfile_Username, friendUsername),
            eq(UserFriendTable.AddedProfile_Username, username)
        ))

        return { success: true } 
    } catch(err) {
        console.error(err);
        return { error: "Server error" };
    }
}

export async function removeFriend(friendUsername: string) {

}

export async function getFriends(limit: number = 10, offset: number = 0) {
    try {
        const authRes = await authenticateUser();
        if(!authRes.success) return { error: authRes.error };

        const { username } = authRes;

        const friendList = await db.select({
            username: UserProfileTable.Username,
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
                    not(eq(UserProfileTable.Username, username))
                )
            )
            .limit(limit)
            .offset(offset);

            return {
                success: true,
                friendList
            }
    } catch(err) {
        console.error(err);
        return { error: "Server error" };
    }
}
