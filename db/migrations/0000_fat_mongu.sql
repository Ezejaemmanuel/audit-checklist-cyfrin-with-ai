CREATE TABLE IF NOT EXISTS "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "categories_category_unique" UNIQUE("category")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "data_level_1" (
	"id" text PRIMARY KEY NOT NULL,
	"category_id" text NOT NULL,
	"category" text,
	"description" text NOT NULL,
	"question" text,
	"remediation" text,
	"references" text[] DEFAULT '{}',
	"tags" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "data_level_2" (
	"id" text PRIMARY KEY NOT NULL,
	"parent_id" text NOT NULL,
	"category" text,
	"description" text NOT NULL,
	"question" text,
	"remediation" text,
	"references" text[] DEFAULT '{}',
	"tags" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "data_level_3" (
	"id" text PRIMARY KEY NOT NULL,
	"parent_id" text NOT NULL,
	"description" text NOT NULL,
	"question" text NOT NULL,
	"remediation" text NOT NULL,
	"references" text[] DEFAULT '{}',
	"tags" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resync_history" (
	"id" text PRIMARY KEY NOT NULL,
	"last_resync_date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "data_level_1" ADD CONSTRAINT "data_level_1_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "data_level_2" ADD CONSTRAINT "data_level_2_parent_id_data_level_1_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."data_level_1"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "data_level_3" ADD CONSTRAINT "data_level_3_parent_id_data_level_2_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."data_level_2"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
