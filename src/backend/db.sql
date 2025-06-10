DROP DATABASE IF EXISTS `card_game`;

DROP USER IF EXISTS 'klazebnyi'@'localhost';

CREATE DATABASE `card_game`;

CREATE USER 'klazebnyi'@'localhost' IDENTIFIED BY 'securepass';

GRANT ALL PRIVILEGES ON `card_game`.* TO 'klazebnyi'@'localhost';

FLUSH PRIVILEGES;

USE `card_game`;

CREATE TABLE `users`(
    id INT AUTO_INCREMENT NOT NULL UNIQUE ,
    login VARCHAR(32) NOT NULL UNIQUE ,
    password VARCHAR(512) NOT NULL ,
    name VARCHAR(64) NOT NULL ,
    email  VARCHAR(64) NOT NULL UNIQUE,
    games_qty INT DEFAULT 0,
    victories_qty INT DEFAULT 0,
    avatar VARCHAR(128)
)