CREATE TABLE "UserFriend" (
	"UserProfile_Username" varchar(32) NOT NULL,
	"AddedProfile_Username" varchar(32) NOT NULL,
	"IsAccepted" boolean NOT NULL,
	CONSTRAINT "UserFriend_UserProfile_Username_AddedProfile_Username_pk" PRIMARY KEY("UserProfile_Username","AddedProfile_Username")
);
--> statement-breakpoint
ALTER TABLE "UserFriend" ADD CONSTRAINT "UserFriend_UserProfile_Username_UserProfile_Username_fk" FOREIGN KEY ("UserProfile_Username") REFERENCES "public"."UserProfile"("Username") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserFriend" ADD CONSTRAINT "UserFriend_AddedProfile_Username_UserProfile_Username_fk" FOREIGN KEY ("AddedProfile_Username") REFERENCES "public"."UserProfile"("Username") ON DELETE no action ON UPDATE no action;