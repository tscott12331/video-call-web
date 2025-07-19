"use server";

import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { authenticateUser } from "./auth";
import { UserProfileTable } from "../db/schemas/user";

export async function getUserProfile() {
    try {
        const authRes = await authenticateUser();
        if(!authRes.success || !authRes.username) return { 
            error: authRes.error,
            success: false,
        };

        const { username } = authRes;

        const userArr = await db.select({
            Username: UserProfileTable.Username,
            UserBio: UserProfileTable.UserBio,
            CreatedAt: UserProfileTable.CreatedAt,
            UpdatedAt: UserProfileTable.UpdatedAt,
        }).from(UserProfileTable)
                            .where(eq(UserProfileTable.Username, username))
        if(userArr.length === 0) return {
            success: false,
            error: "User does not exist",
        };

        const userProfile = userArr[0];

        return {
            success: true,
            userProfile,
        };
    } catch(err) {
        console.error(err);
        return {
            error: "Server error",
            success: false,
        }
    }
}

type TUserProfileUpdateObj = {
    UserBio: string;
}

export async function updateUserProfile(updateObj: TUserProfileUpdateObj) {
    try {
        const authRes = await authenticateUser();
        if(!authRes.success || !authRes.username) return { 
            error: authRes.error,
            success: false,
        };

        const { username } = authRes;

        await db.update(UserProfileTable).set(updateObj)
                .where(eq(UserProfileTable.Username, username));

        return {
            success: true,
        }
    } catch(err) {
        console.error(err);
        return {
            error: "Server error",
            success: false,
        }
    }
    
}
