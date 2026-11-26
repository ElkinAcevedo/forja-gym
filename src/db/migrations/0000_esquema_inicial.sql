CREATE TABLE `achievement` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`rule` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `assistant_config` (
	`program_id` text NOT NULL,
	`days_per_week` integer NOT NULL,
	`position` integer NOT NULL,
	`name` text NOT NULL,
	`explanation` text NOT NULL,
	`week` text NOT NULL,
	PRIMARY KEY(`program_id`, `days_per_week`, `position`),
	FOREIGN KEY (`program_id`) REFERENCES `program_template`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "assistant_config_days" CHECK("assistant_config"."days_per_week" BETWEEN 2 AND 6)
);
--> statement-breakpoint
CREATE TABLE `day_template` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`focus` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `day_template_exercise` (
	`day_template_id` text NOT NULL,
	`position` integer NOT NULL,
	`exercise_id` text NOT NULL,
	PRIMARY KEY(`day_template_id`, `position`),
	FOREIGN KEY (`day_template_id`) REFERENCES `day_template`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `equipment` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `exercise` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`equipment_id` text NOT NULL,
	`is_compound` integer NOT NULL,
	`tracking` text DEFAULT 'weight_reps' NOT NULL,
	`image` text,
	FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `exercise_muscle` (
	`exercise_id` text NOT NULL,
	`muscle_id` text NOT NULL,
	`role` text NOT NULL,
	PRIMARY KEY(`exercise_id`, `muscle_id`),
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`muscle_id`) REFERENCES `muscle`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `level_standard` (
	`exercise_id` text NOT NULL,
	`level` integer NOT NULL,
	`kg_at_75` real NOT NULL,
	PRIMARY KEY(`exercise_id`, `level`),
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "level_standard_level" CHECK("level_standard"."level" BETWEEN 0 AND 4)
);
--> statement-breakpoint
CREATE TABLE `muscle` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`view` text NOT NULL,
	`muscle_group` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `program_template` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`abbr` text NOT NULL,
	`tag` text NOT NULL,
	`level` text NOT NULL,
	`days_label` text NOT NULL,
	`description` text NOT NULL,
	`tips` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `program_template_day` (
	`program_id` text NOT NULL,
	`position` integer NOT NULL,
	`day_template_id` text NOT NULL,
	PRIMARY KEY(`program_id`, `position`),
	FOREIGN KEY (`program_id`) REFERENCES `program_template`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`day_template_id`) REFERENCES `day_template`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rep_scheme` (
	`goal` text NOT NULL,
	`is_compound` integer NOT NULL,
	`sets` integer NOT NULL,
	`rep_min` integer NOT NULL,
	`rep_max` integer NOT NULL,
	PRIMARY KEY(`goal`, `is_compound`)
);
--> statement-breakpoint
CREATE TABLE `body_weight` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`date` text NOT NULL,
	`kg` real NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `user_profile`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "body_weight_kg" CHECK("body_weight"."kg" BETWEEN 30 AND 300)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `body_weight_user_date` ON `body_weight` (`user_id`,`date`);--> statement-breakpoint
CREATE TABLE `goal` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`exercise_id` text,
	`start_value` real NOT NULL,
	`target_value` real NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`achieved_at` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `user_profile`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `routine` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`is_active` integer DEFAULT false NOT NULL,
	`source_program_id` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `user_profile`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`source_program_id`) REFERENCES `program_template`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `routine_one_active` ON `routine` (`user_id`) WHERE "routine"."is_active" = 1 AND "routine"."deleted_at" IS NULL;--> statement-breakpoint
CREATE TABLE `routine_day` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`routine_id` text NOT NULL,
	`weekday` integer NOT NULL,
	`name` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `user_profile`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`routine_id`) REFERENCES `routine`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "routine_day_weekday_range" CHECK("routine_day"."weekday" BETWEEN 0 AND 6)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `routine_day_weekday` ON `routine_day` (`routine_id`,`weekday`);--> statement-breakpoint
CREATE TABLE `routine_day_exercise` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`routine_day_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`position` integer NOT NULL,
	`sets` integer,
	`rep_min` integer,
	`rep_max` integer,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `user_profile`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`routine_day_id`) REFERENCES `routine_day`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `routine_day_exercise_day` ON `routine_day_exercise` (`routine_day_id`);--> statement-breakpoint
CREATE TABLE `set_log` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`session_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`position` integer NOT NULL,
	`weight_kg` real,
	`reps` integer,
	`duration_s` integer,
	`distance_m` real,
	`completed_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`is_pr` integer DEFAULT false NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `user_profile`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`session_id`) REFERENCES `workout_session`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "set_log_weight" CHECK("set_log"."weight_kg" BETWEEN 0 AND 500),
	CONSTRAINT "set_log_reps" CHECK("set_log"."reps" BETWEEN 0 AND 100),
	CONSTRAINT "set_log_duration" CHECK("set_log"."duration_s" >= 0),
	CONSTRAINT "set_log_distance" CHECK("set_log"."distance_m" >= 0)
);
--> statement-breakpoint
CREATE INDEX `set_log_exercise_completed` ON `set_log` (`exercise_id`,`completed_at`);--> statement-breakpoint
CREATE INDEX `set_log_session` ON `set_log` (`session_id`);--> statement-breakpoint
CREATE TABLE `streak_restore` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`date` text NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `user_profile`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `streak_restore_user_date` ON `streak_restore` (`user_id`,`date`);--> statement-breakpoint
CREATE TABLE `user_achievement` (
	`user_id` text NOT NULL,
	`achievement_id` text NOT NULL,
	`unlocked_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`deleted_at` text,
	PRIMARY KEY(`user_id`, `achievement_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user_profile`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`achievement_id`) REFERENCES `achievement`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_profile` (
	`id` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`sex` text,
	`birth_date` text,
	`height_cm` integer,
	`goal` text DEFAULT 'hypertrophy' NOT NULL,
	`unit` text DEFAULT 'kg' NOT NULL,
	`increment_kg` real DEFAULT 2.5 NOT NULL,
	`rest_seconds` integer DEFAULT 90 NOT NULL,
	`autofill` integer DEFAULT true NOT NULL,
	`reminders` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`deleted_at` text,
	CONSTRAINT "user_profile_height" CHECK("user_profile"."height_cm" BETWEEN 100 AND 250),
	CONSTRAINT "user_profile_increment" CHECK("user_profile"."increment_kg" IN (1, 2.5, 5)),
	CONSTRAINT "user_profile_rest" CHECK("user_profile"."rest_seconds" IN (60, 90, 120, 180))
);
--> statement-breakpoint
CREATE TABLE `workout_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`routine_day_id` text,
	`started_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`ended_at` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `user_profile`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`routine_day_id`) REFERENCES `routine_day`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `workout_session_started` ON `workout_session` (`user_id`,`started_at`);