CREATE TABLE `favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('player','club') NOT NULL,
	`tag` varchar(32) NOT NULL,
	`name` varchar(128),
	`icon` varchar(512),
	`trophies` int DEFAULT 0,
	`lastCheckedTrophies` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_type_tag_idx` UNIQUE(`userId`,`type`,`tag`)
);
--> statement-breakpoint
CREATE TABLE `trophy_snapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tag` varchar(32) NOT NULL,
	`trophies` int NOT NULL,
	`highestTrophies` int DEFAULT 0,
	`data` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `trophy_snapshots_id` PRIMARY KEY(`id`)
);
