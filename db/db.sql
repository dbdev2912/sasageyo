DROP DATABASE IF EXISTS SASAGEYO;
CREATE DATABASE SASAGEYO;
USE SASAGEYO;
SET NAMES UTF8;

CREATE TABLE USERS(
	`user_id`  VARCHAR(255) PRIMARY KEY NOT NULL,
    `password` VARCHAR(255) NOT NULL
)CHARSET UTF8 COLLATE UTF8_GENERAL_CI;

CREATE TABLE PROFILES(
	`user_id` VARCHAR(255),
    `user_token` VARCHAR(255) PRIMARY KEY NOT NULL,
    `name` VARCHAR(255),
    `date_of_birth` DATE,
	`avatar` TEXT,
    `website` TEXT,
    `email` VARCHAR(255),
    `phone` VARCHAR(255),
    `gender` VARCHAR(255),
    `bio` TEXT
)CHARSET UTF8 COLLATE UTF8_GENERAL_CI;

CREATE TABLE POSTS(
	`post_id` VARCHAR(255) PRIMARY KEY NOT NULL,
    `user_id` VARCHAR(255), -- FK
	`content` TEXT,
    `post_date` DATETIME 
)CHARSET UTF8 COLLATE UTF8_GENERAL_CI;

CREATE TABLE FOLLOWED(
	`user_id` VARCHAR(255),
    `target` VARCHAR(255) -- user_id
)CHARSET UTF8 COLLATE UTF8_GENERAL_CI;

CREATE TABLE POST_CONTENT(
	`post_id` VARCHAR(255),
    `url` TEXT
)CHARSET UTF8 COLLATE UTF8_GENERAL_CI;

CREATE TABLE LIKES(
	`post_id` VARCHAR(255),
    `user_id` VARCHAR(255),
    `time` DATETIME
)CHARSET UTF8 COLLATE UTF8_GENERAL_CI;


CREATE TABLE COMMENTS(
	`post_id` VARCHAR(255),
    `user_id` VARCHAR(255),
    `time` DATETIME,
    `content` TEXT
)CHARSET UTF8 COLLATE UTF8_GENERAL_CI;


CREATE TABLE TEMP_IMG(
	url TEXT
);


CREATE TABLE NOTIFY(
	`user_id` VARCHAR(255),
    `target_id` VARCHAR(255),
	`url` VARCHAR(255),
    `content` TEXT,
    `time` DATETIME
)CHARSET UTF8 COLLATE UTF8_GENERAL_CI;

CREATE TABLE SAVED(
	`user_id` VARCHAR(255),
	`post_id` VARCHAR(255),
    `time` DATETIME
)CHARSET UTF8 COLLATE UTF8_GENERAL_CI;


CREATE TABLE ROOMKEY
(
	`user_id_1` VARCHAR(255),
    `user_id_2` VARCHAR(255),
    `rkey` VARCHAR(255)  
) CHARSET UTF8 COLLATE UTF8_GENERAL_CI;

CREATE TABLE MESSAGES
(
	`rkey` VARCHAR(255),
    `sender` VARCHAR(255),
    `time` DATETIME,
    `content` TEXT,
    `ctype` ENUM('video', 'img', 'text', 'other')
) CHARSET UTF8 COLLATE UTF8_GENERAL_CI;

ALTER TABLE ROOMKEY ADD CONSTRAINT `pk_roomkey` PRIMARY KEY (`user_id_1`, `user_id_2`);

ALTER TABLE PROFILES ADD CONSTRAINT `fk_profiles_users` 
						 FOREIGN KEY (`user_id`) 
                         REFERENCES USERS(`user_id`) ON UPDATE CASCADE;
                         
ALTER TABLE POSTS ADD CONSTRAINT `fk_post_user_token` 
						 FOREIGN KEY (`user_id`)
						 REFERENCES USERS(`user_id`) ON UPDATE CASCADE;
                         
ALTER TABLE FOLLOWED ADD CONSTRAINT PRIMARY KEY(`user_id`, `target`);

ALTER TABLE FOLLOWED ADD CONSTRAINT `fk_user_user_id` 
						 FOREIGN KEY (`user_id`) 
                         REFERENCES USERS(`user_id`) ON UPDATE CASCADE;
                         
ALTER TABLE FOLLOWED ADD CONSTRAINT `fk_target_user_id` 
						 FOREIGN KEY (`target`) 
                         REFERENCES USERS(`user_id`) ON UPDATE CASCADE;

ALTER TABLE LIKES ADD CONSTRAINT PRIMARY KEY(`user_id`, `post_id`, `time`);
ALTER TABLE LIKES ADD CONSTRAINT `fk_likes_user`
						 FOREIGN KEY (`user_id`) 
                         REFERENCES USERS(`user_id`) ON DELETE CASCADE;

ALTER TABLE COMMENTS ADD CONSTRAINT PRIMARY KEY(`user_id`, `post_id`, `time`);                         
ALTER TABLE COMMENTS ADD CONSTRAINT `fk_cmt_user`
						 FOREIGN KEY (`user_id`) 
                         REFERENCES USERS(`user_id`) ON DELETE CASCADE;
                         
ALTER TABLE NOTIFY ADD CONSTRAINT `fk_notify_user` FOREIGN KEY (`user_id`) 
						 REFERENCES USERS(`user_id`) ON DELETE CASCADE;

ALTER TABLE NOTIFY ADD CONSTRAINT `fk_notify_target` FOREIGN KEY (`target_id`) 
						 REFERENCES USERS(`user_id`) ON DELETE CASCADE;

                         
ALTER TABLE SAVED ADD CONSTRAINT `fk_save_user` FOREIGN KEY (`user_id`) 
						 REFERENCES USERS(`user_id`) ON DELETE CASCADE;

ALTER TABLE SAVED ADD CONSTRAINT `fk_save_post` FOREIGN KEY (`post_id`)
						 REFERENCES POSTS(`post_id`) ON DELETE CASCADE;
   