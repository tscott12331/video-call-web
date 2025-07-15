"use server";

import { and, asc, eq } from "drizzle-orm";
import { db } from "../db/db";
import { ChatMessage, ChatRoomTable, UserProfile_ChatRoom } from "../db/schemas/chat";
import { authenticateUser } from "./auth";
import { TChatMessage } from "@/app/page";

export async function getChatMessages(roomId: string, offset: number = 0, limit: number = 100) {
    try {
        const authRes = await authenticateUser();
        if(!authRes.success || !authRes.username) return { 
            error: authRes.error,
            success: false,
        };

        const { username } = authRes;

        const userChatRoom = await db.select().from(UserProfile_ChatRoom)
                .where(and(
                    eq(UserProfile_ChatRoom.Username, username),
                    eq(UserProfile_ChatRoom.ChatRoomId, roomId)
                ))

        if(userChatRoom.length === 0) return {
            success: false,
            error: "User is not a part of this room",
        }

        const messages: TChatMessage[] = await db.select({
            messageId: ChatMessage.ChatMessageId,
            chatTime: ChatMessage.ChatTime,
            content: ChatMessage.Content,
            username: ChatMessage.Username,
            roomId: ChatMessage.ChatRoomId
        }).from(ChatMessage)
            .where(eq(ChatMessage.ChatRoomId, roomId))
            .limit(limit)
            .offset(offset)
            .orderBy(asc(ChatMessage.ChatTime));

        return {
            success: true,
            messages
        }
    } catch(err) {
        console.error(err);

        return {
            success: false,
            error: "Server error",
        }
    }
}

export async function createRoom(friends: string[], name?: string) {
    try {
        const authRes = await authenticateUser();
        if(!authRes.success || !authRes.username) return { 
            error: authRes.error,
            success: false,
        };

        const { username } = authRes;
        
        if(friends.length <= 1) return {
            success: false,
            error: "Need 2+ friends to create a group"
        }

        const roomName = name ?? username.concat(', ', friends.join(', '));


        const room = (await db.insert(ChatRoomTable).values({
            ChatRoomName: roomName,
        }).returning({
            id: ChatRoomTable.ChatRoomId,
            name: ChatRoomTable.ChatRoomName,
        }))[0];
        
        const userArr = [{
            Username: username,
            ChatRoomId: room.id
        }, ...friends.map(friend => ({
            Username: friend,
            ChatRoomId: room.id
        }))];

        await db.insert(UserProfile_ChatRoom).values(userArr).returning();
        
        return { 
            success: true,
            room
        }
    } catch(err) {
        console.error(err);
        return {
            success: false,
            error: "Server error",
        }
    }

}
