import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";

export const ImageTable = pgTable("Image", {
    ImageId: uuid('ImageId').defaultRandom().primaryKey(),
    ImagePath: varchar('ImagePath', { length: 512 }).notNull(),
    ImageType: varchar('ImageType', { length: 32 }).notNull(),
});
