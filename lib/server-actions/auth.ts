'use server';
import bcrypt from 'bcrypt';
import { UserProfileTable, UserCredentialTable } from '../db/schemas/user';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';

export async function login(prevState: unknown, formData: FormData) {
    const username = formData.get('username')?.toString();
    const password = formData.get('password')?.toString();
    if(!username || !password) return { error: "Missing required field" };
    
    try {
        const pwdArray = await db.select({
            Password: UserCredentialTable.Password
        }).from(UserProfileTable)
            .innerJoin(UserCredentialTable, 
                       eq(UserProfileTable.Username, UserCredentialTable.Username));
        
        const res = await bcrypt.compare(password, pwdArray[0].Password)

        if(res) {
            return {
                success: true
            }
        } else {
            return {
                error: "Incorrect username or password"
            };
        }
    } catch(error) {
        console.error(error);
        return { error: "Server error" };
    }
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

        return {
            success: true
        };

    } catch(error) {
        console.error(error);
        return { error: "Server error" };
    }
}
