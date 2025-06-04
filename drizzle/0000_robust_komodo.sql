CREATE TABLE "UserCredential" (
	"UserId" uuid PRIMARY KEY NOT NULL,
	"Password" char(60) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "UserProfile" (
	"UserId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"Username" varchar(32) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "UserCredential" ADD CONSTRAINT "UserCredential_UserId_UserProfile_UserId_fk" FOREIGN KEY ("UserId") REFERENCES "public"."UserProfile"("UserId") ON DELETE no action ON UPDATE no action;