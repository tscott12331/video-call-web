"use server";

import { and, eq, ilike, not, or } from "drizzle-orm";
import { db } from "../db/db";
import { UserFriendTable, UserProfileTable } from "../db/schemas/user";
import { cookies } from "next/headers";
import { verifyJWT } from "../auth/jwt";

export async function searchUsers(phrase: string, limit: number = 10, offset: number = 0) {
    try {
        const token = (await cookies()).get('token')?.value;
        if(!token) return [];

        const tokenValue = await verifyJWT(token);
        if(!tokenValue) return [];

        const username = tokenValue.payload.username as string|undefined;
        if(!username) return [];

        const userList = await db.select({
            username: UserProfileTable.Username,
            requestIsAccepted: UserFriendTable.IsAccepted,
        }).from(UserProfileTable)
        .leftJoin(UserFriendTable,
                  or(
                    and(
                      eq(UserFriendTable.UserProfile_Username, username),
                      eq(UserProfileTable.Username, UserFriendTable.AddedProfile_Username)
                    ),
                    and(
                      eq(UserFriendTable.AddedProfile_Username, username),
                      eq(UserProfileTable.Username, UserFriendTable.UserProfile_Username)
                    )
                  )
                  
                 )
                 .where(
                     and(
                         not(eq(UserProfileTable.Username, username)),
                         ilike(UserProfileTable.Username, `%${phrase}%`))
                 )
                 .limit(limit)
                 .offset(offset);

            console.log(userList);
         return userList;
         //return userList.filter((user) => user.username !== username)
    } catch(err) {
        console.error(err);
        return [];
    }
}
