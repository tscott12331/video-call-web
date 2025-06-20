"use server";

import { cookies } from "next/headers";
import { db } from "../db/db";
import { UserFriendTable } from "../db/schemas/user";
import { verifyJWT } from "../auth/jwt";

export async function addFriend(friendUsername: string) {
    if(!friendUsername) return { error: "Not a valid user to add" };
    try {
        const tokenCookie = (await cookies()).get('token');
        if(!tokenCookie) return { error: "Not logged in" };

        const token = tokenCookie.value;
        const tokenValue = await verifyJWT(token);
        if(!tokenValue || !tokenValue.payload.username) return { error: "Not logged in" };

        const username = tokenValue.payload.username as string;
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

export async function acceptFriend() {

}

export async function removeFriend() {

}
