import { pgTable, varchar, char, timestamp, boolean, primaryKey, uuid } from "drizzle-orm/pg-core";
import { ChatRoomTable } from "./chat";
import { ImageTable } from "./image";

export const UserProfileTable = pgTable("UserProfile", {
    Username: varchar("Username", { length: 32 }).notNull().primaryKey(),
    UserBio: varchar("UserBio", { length: 256 }).notNull().default(""),
    UserPfp: uuid('UserPfp').references(() => ImageTable.ImageId),
    CreatedAt: timestamp("CreatedAt").defaultNow().notNull(),
    UpdatedAt: timestamp("UpdatedAt").defaultNow().notNull()
});

export const UserCredentialTable = pgTable("UserCredential", {
    Username: varchar("Username", { length: 32 }).primaryKey().notNull().references(() => UserProfileTable.Username),
    Password: char("Password", { length: 60 }).notNull()
});

export const UserFriendTable = pgTable("UserFriend", {
    UserProfile_Username: varchar("UserProfile_Username", { length: 32 }).notNull().references(() => UserProfileTable.Username),
    AddedProfile_Username: varchar("AddedProfile_Username", { length: 32 }).notNull().references(() => UserProfileTable.Username),
    IsAccepted: boolean("IsAccepted").notNull(),
    ChatRoomId: uuid('ChatRoomId').references(() => ChatRoomTable.ChatRoomId),
}, (table) => [
        primaryKey({ columns: [table.UserProfile_Username, table.AddedProfile_Username]})
    ]
);
