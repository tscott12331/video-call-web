'use server';
import bcrypt from 'bcrypt';
import { UserProfileTable, UserCredentialTable } from '../db/schemas/user';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { createSignedJWT, verifyJWT } from '../auth/jwt';
import { redirect } from 'next/navigation';

export async function login(prevState: unknown, formData: FormData) {
    const username = formData.get('username')?.toString();
    const password = formData.get('password')?.toString();
    if(!username || !password) return { 
        error: "Missing required field",
        success: false,
    };
    
    try {
        const pwdArray = await db.select({
            Password: UserCredentialTable.Password
        }).from(UserProfileTable)
            .innerJoin(UserCredentialTable, 
                       eq(UserProfileTable.Username, UserCredentialTable.Username))
            .where(eq(UserProfileTable.Username, username));
        
        
        if(!await bcrypt.compare(password, pwdArray[0].Password)) {
            return {
                error: "Incorrect username or password",
                success: false,
            };
        }

        
        (await cookies()).set('token', await createSignedJWT(username));
    } catch(error) {
        console.error(error);
        return { 
            error: "Server error",
            success: false,
        };
    }
    redirect('/');
}

export async function signup(prevState: unknown, formData: FormData) {
    const username = formData.get('username')?.toString();
    const password = formData.get('password')?.toString();
    if(!username || !password) return { 
        error: "Missing required field",
        success: false
    };
    
    try {
        const userList = await db.select().from(UserProfileTable)
                                .where(eq(UserProfileTable.Username, username));
        
        if(userList.length > 0) {
            return { 
                error: "Username is taken",
                success: false,
            };
        }
        
        await db.insert(UserProfileTable).values({
            Username: username,
        });


        const hashword = await bcrypt.hash(password, 12);
        await db.insert(UserCredentialTable).values({
            Username: username,
            Password: hashword
        });


    } catch(error) {
        console.error(error);
        return { 
            error: "Server error",
            success: false,
        };
    } finally {
        redirect('/');
    }
}

export const authenticateUser = async () => {
    try {
        const tokenCookie = (await cookies()).get('token');
        if(!tokenCookie) return { 
            error: "Not logged in",
            success: false,
        };

        const token = tokenCookie.value;
        const tokenValue = await verifyJWT(token);
        if(!tokenValue || !tokenValue.payload.username) return { 
            error: "Not logged in" ,
            success: false,
        };

        return {
            success: true,
            username: tokenValue.payload.username as string
        };
    } catch(err) {
        console.error(err);
        return { 
            error: "Server error",
            success: false,
        };
    }
}

export const logout = async () => {
    try {
        (await cookies()).delete('token');
    } catch(err) {
        console.error(err);
    } finally {
        redirect('/login');
    }
}
