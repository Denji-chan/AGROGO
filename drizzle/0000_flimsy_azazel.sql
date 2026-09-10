CREATE TABLE `agrogo_leads` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`region` text NOT NULL,
	`service` text NOT NULL,
	`role` text NOT NULL,
	`locale` text NOT NULL,
	`consent` integer NOT NULL,
	`created_at` text NOT NULL
);
