import { pgTable, varchar, char, timestamp } from "drizzle-orm/pg-core";

export const UserProfileTable = pgTable("UserProfile", {
    Username: varchar("Username", { length: 32 }).notNull().primaryKey(),
    UserBio: varchar("UserBio", { length: 256 }),
    CreatedAt: timestamp("CreatedAt").defaultNow().notNull(),
    UpdatedAt: timestamp("UpdatedAt").defaultNow().notNull()
})

export const UserCredentialTable = pgTable("UserCredential", {
    Username: varchar("Username", { length: 32 }).primaryKey().notNull().references(() => UserProfileTable.Username),
    Password: char("Password", { length: 60 }).notNull()
})
