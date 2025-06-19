"use server";

import { ilike } from "drizzle-orm";
import { db } from "../db/db";
import { UserProfileTable } from "../db/schemas/user";

export async function searchUsers(phrase: string, limit: number = 10, offset: number = 0) {
    try {
        const userList = await db.select({
            username: UserProfileTable.Username
        }).from(UserProfileTable)
        .where(ilike(UserProfileTable.Username, `%${phrase}%`))
        .limit(limit)
        .offset(offset);

        return userList;
    } catch(err) {
        console.error(err);
        return [];
    }
}
