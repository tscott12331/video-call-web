import { pgTable, varchar, timestamp, primaryKey, uuid } from "drizzle-orm/pg-core";
import { UserProfileTable } from "./user";

export const ChatRoomTable = pgTable("ChatRoom", {
    ChatRoomId: uuid('ChatRoomId').defaultRandom().primaryKey(),
    ChatRoomName: varchar('ChatRoomName', { length: 64 })
});

export const UserProfile_ChatRoom = pgTable("UserProfile_ChatRoom", {
    Username: varchar("Username", { length: 32 }).notNull().references(() => UserProfileTable.Username),
    ChatRoomId: uuid('ChatRoomId').notNull().references(() => ChatRoomTable.ChatRoomId),
}, (table) => [
    primaryKey({ columns: [table.Username, table.ChatRoomId] }),
]);

export const ChatMessage = pgTable("ChatMessage", {
    ChatMessageId: uuid('ChatMessageId').defaultRandom().primaryKey(),
    Username: varchar("Username", { length: 32 }).notNull().references(() => UserProfileTable.Username),
    ChatRoomId: uuid('ChatRoomId').references(() => ChatRoomTable.ChatRoomId),
    Content: varchar('Content', { length: 512 }).notNull(),
    ChatTime: timestamp('ChatTime').notNull().defaultNow(),
});
