CREATE TABLE "ChatMessage" (
	"ChatMessageId" uuid PRIMARY KEY DEFAULT '4e37faf9-9df1-4868-95b2-ce99d91a6037' NOT NULL,
	"Username" varchar(32) NOT NULL,
	"ChatRoomId" uuid,
	"Content" varchar(512)
);
--> statement-breakpoint
CREATE TABLE "ChatRoom" (
	"ChatRoomId" uuid PRIMARY KEY DEFAULT '667db518-2216-4c19-836c-349c0acd6d48' NOT NULL,
	"ChatRoomName" varchar(64)
);
--> statement-breakpoint
CREATE TABLE "UserProfile_ChatRoom" (
	"Username" varchar(32) NOT NULL,
	"ChatRoomId" uuid,
	CONSTRAINT "UserProfile_ChatRoom_Username_ChatRoomId_pk" PRIMARY KEY("Username","ChatRoomId")
);
--> statement-breakpoint
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_Username_UserProfile_Username_fk" FOREIGN KEY ("Username") REFERENCES "public"."UserProfile"("Username") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_ChatRoomId_ChatRoom_ChatRoomId_fk" FOREIGN KEY ("ChatRoomId") REFERENCES "public"."ChatRoom"("ChatRoomId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserProfile_ChatRoom" ADD CONSTRAINT "UserProfile_ChatRoom_Username_UserProfile_Username_fk" FOREIGN KEY ("Username") REFERENCES "public"."UserProfile"("Username") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserProfile_ChatRoom" ADD CONSTRAINT "UserProfile_ChatRoom_ChatRoomId_ChatRoom_ChatRoomId_fk" FOREIGN KEY ("ChatRoomId") REFERENCES "public"."ChatRoom"("ChatRoomId") ON DELETE no action ON UPDATE no action;
