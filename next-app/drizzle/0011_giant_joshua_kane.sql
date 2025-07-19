CREATE TABLE "Image" (
	"ImageId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ImagePath" varchar(512) NOT NULL
);
