import { pgTable, varchar, char, uuid } from "drizzle-orm/pg-core";

export const UserProfileTable = pgTable("UserProfile", {
    UserId: uuid().defaultRandom().primaryKey().notNull(),
    Username: varchar("Username", { length: 32 }).notNull(),
})

export const UserCredentialTable = pgTable("UserCredential", {
    UserId: uuid().primaryKey().notNull().references(() => UserProfileTable.UserId),
    Password: char("Password", { length: 60 }).notNull()
})
