CREATE TABLE "UserCredential" (
	"Username" varchar(32) PRIMARY KEY NOT NULL,
	"Password" char(60) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "UserProfile" (
	"Username" varchar(32) PRIMARY KEY NOT NULL,
	"UserBio" varchar(256),
	"CreatedAt" timestamp DEFAULT now() NOT NULL,
	"UpdatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "UserCredential" ADD CONSTRAINT "UserCredential_Username_UserProfile_Username_fk" FOREIGN KEY ("Username") REFERENCES "public"."UserProfile"("Username") ON DELETE no action ON UPDATE no action;