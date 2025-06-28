ALTER TABLE "ChatMessage" ALTER COLUMN "ChatMessageId" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "ChatRoom" ALTER COLUMN "ChatRoomId" SET DEFAULT gen_random_uuid();