"use server";

import { ilike } from "drizzle-orm";
import { db } from "../db/db";
import { UserProfileTable } from "../db/schemas/user";
import { cookies } from "next/headers";
import { verifyJWT } from "../auth/jwt";

export async function searchUsers(phrase: string, limit: number = 10, offset: number = 0) {
    try {
        const userList = await db.select({
            username: UserProfileTable.Username
        }).from(UserProfileTable)
        .where(ilike(UserProfileTable.Username, `%${phrase}%`))
        .limit(limit)
        .offset(offset);

        const token = (await cookies()).get('token');

        if(token) {
            const tokenUsername = await verifyJWT(token.value);
            if(!!tokenUsername) {
                return userList.filter((user) => user.username !== tokenUsername.payload.username)
            }
        }

        return userList;
    } catch(err) {
        console.error(err);
        return [];
    }
}
