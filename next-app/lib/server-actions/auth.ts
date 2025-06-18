'use server';
import bcrypt from 'bcrypt';
import { UserProfileTable, UserCredentialTable } from '../db/schemas/user';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { createSignedJWT } from '../auth/jwt';
import { redirect } from 'next/navigation';

export async function login(prevState: unknown, formData: FormData) {
    const username = formData.get('username')?.toString();
    const password = formData.get('password')?.toString();
    if(!username || !password) return { error: "Missing required field" };
    
    try {
        const pwdArray = await db.select({
            Password: UserCredentialTable.Password
        }).from(UserProfileTable)
            .innerJoin(UserCredentialTable, 
                       eq(UserProfileTable.Username, UserCredentialTable.Username))
            .where(eq(UserProfileTable.Username, username));
        
        
        if(!await bcrypt.compare(password, pwdArray[0].Password)) {
            return {
                error: "Incorrect username or password"
            };
        }

        
        (await cookies()).set('token', await createSignedJWT(username));
    } catch(error) {
        console.error(error);
        return { error: "Server error" };
    }
    redirect('/');
}

export async function signup(prevState: unknown, formData: FormData) {
    const username = formData.get('username')?.toString();
    const password = formData.get('password')?.toString();
    if(!username || !password) return { error: "Missing required field" };
    
    try {
        const userList = await db.select().from(UserProfileTable)
                                .where(eq(UserProfileTable.Username, username));
        
        if(userList.length > 0) {
            return { 
                error: "Username is taken"
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
        return { error: "Server error" };
    } finally {
        redirect('/');
    }
}
