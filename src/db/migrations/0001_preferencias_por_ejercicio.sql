CREATE TABLE `exercise_preference` (
	`user_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`rest_seconds` integer,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`deleted_at` text,
	PRIMARY KEY(`user_id`, `exercise_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user_profile`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "exercise_preference_rest" CHECK("exercise_preference"."rest_seconds" BETWEEN 15 AND 600)
);
