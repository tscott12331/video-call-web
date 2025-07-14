"use server";

import { and, eq, ilike, not, or } from "drizzle-orm";
import { db } from "../db/db";
import { UserFriendTable, UserProfileTable } from "../db/schemas/user";
import { cookies } from "next/headers";
import { verifyJWT } from "../auth/jwt";

export async function searchUsers(phrase: string, limit: number = 10, offset: number = 0) {
    try {
        const token = (await cookies()).get('token')?.value;
        if(!token) return {
            success: false,
            error: "Authentication error"
        }

        const tokenValue = await verifyJWT(token);
        if(!tokenValue) return {
            success: false,
            error: "Authentication error",
        };

        const username = tokenValue.payload.username as string|undefined;
        if(!username) return {
            success: false,
            error: "Authentication error",
        } 

        const res = await searchFriendTable(phrase, username, false, limit, offset);

        if(!res.success || res.error || !res.userList) return {
            success: false,
            error: res.error,
        }

         return {
            success: true,
            userList: res.userList,
         }
    } catch(err) {
        console.error(err);
        return {
            success: false,
            error: "Server error",
        };
    }
}

export async function searchFriends(phrase: string, limit: number = 10, offset: number = 0) {
    try {
        const token = (await cookies()).get('token')?.value;
        if(!token) return {
            success: false,
            error: "Authentication error",
        };

        const tokenValue = await verifyJWT(token);
        if(!tokenValue) return {
            success: false,
            error: "Authentication error",
        };

        const username = tokenValue.payload.username as string|undefined;
        if(!username) return {
            success: false,
            error: "Authentication error",
        };

        const res = await searchFriendTable(phrase, username, true, limit, offset);
        if(!res.success || res.error || !res.userList) return {
            success: false,
            error: res.error,
        }

        return {
            success: true,
            userList: res.userList,
        }

    } catch(err) {
        console.error(err);
        return {
            success: false,
            error: "Server error",
        }
    }
}

async function searchFriendTable(phrase: string, username: string, friendsOnly: boolean, limit: number = 10, offset: number = 0) {
    try {
        const whereExpression = friendsOnly ?
                 and(
                     not(eq(UserProfileTable.Username, username)),
                     ilike(UserProfileTable.Username, `%${phrase}%`),
                     eq(UserFriendTable.IsAccepted, true),
                 )
            :
                 and(
                     not(eq(UserProfileTable.Username, username)),
                     ilike(UserProfileTable.Username, `%${phrase}%`)
                );

        const friendsOnlySelect = {
            username: UserProfileTable.Username,
        }

        const allUsersSelect = {
                username: UserProfileTable.Username,
                requestIsAccepted: UserFriendTable.IsAccepted,
        };



        const userList = await db.select(friendsOnly ? friendsOnlySelect : allUsersSelect)
        .from(UserProfileTable)
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
                     whereExpression
                 )
                 .limit(limit)
                 .offset(offset);

    return {
        success: true,
        userList,
    };

    
    } catch(err) {
        console.error(err);
        return {
            success: false,
            error: "Server error",
        }
    }
}
