CREATE TABLE `download_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`service` enum('mega','drive','telegram','torrent') NOT NULL,
	`url` varchar(2048) NOT NULL,
	`isEnabled` boolean NOT NULL DEFAULT false,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `download_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `download_links_service_unique` UNIQUE(`service`)
);
