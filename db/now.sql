-- MySQL dump 10.13  Distrib 8.0.21, for Win64 (x86_64)
--
-- Host: localhost    Database: sasageyo
-- ------------------------------------------------------
-- Server version	8.0.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `post_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `time` datetime NOT NULL,
  `content` text,
  PRIMARY KEY (`user_id`,`post_id`,`time`),
  CONSTRAINT `fk_cmt_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES ('minu12021319175851863','minu1','2021-03-20 14:58:27','Hiiii'),('minu12021319175851863','minu1','2021-03-20 16:03:25','1'),('minu12021319175851863','minu1','2021-03-20 16:03:28','2'),('minu12021319175851863','minu1','2021-03-20 16:03:29','3'),('minu12021319175851863','minu1','2021-03-20 16:03:30','4'),('minu12021319175851863','minu1','2021-03-20 16:03:31','5'),('minu12021319175851863','minu1','2021-03-20 16:03:34','6'),('minu12021319175851863','minu1','2021-03-20 16:03:36','8'),('minu12021319175851863','minu1','2021-03-20 16:04:27','9'),('minu12021319175851863','minu1','2021-03-20 16:04:28','10'),('minu12021319175851863','minu1','2021-03-20 16:04:29','11'),('minu12021319175851863','minu1','2021-03-20 16:04:32','12'),('minu12021319175851863','minu1','2021-03-20 16:04:33','13'),('minu12021319175851863','minu1','2021-03-20 16:04:34','14'),('minu12021319175851863','minu1','2021-03-20 16:04:36','15'),('minu12021319175851863','minu1','2021-03-20 16:04:37','16'),('minu12021319175851863','minu1','2021-03-20 16:04:38','17'),('minu12021319175851863','minu1','2021-03-20 16:04:39','18'),('minu12021319175851863','minu1','2021-03-20 16:04:40','19'),('minu12021319175851863','minu1','2021-03-20 16:04:41','20'),('minu12021319175851863','minu1','2021-03-20 16:21:50','lz què j z'),('minu12021319184626947','minu1','2021-03-20 17:00:59','Chồ ô cute dữ'),('minu120213191846393','minu1','2021-03-20 15:48:29','Gà trộm chóa'),('minu12021319184712685','minu1','2021-03-20 16:42:23','Áwwwwwwwwwww chế chị r em ơi'),('minu12021319175851863','minu2','2021-03-20 14:26:42','Hiiiiii'),('minu12021319175851863','minu2','2021-03-20 14:29:20','Hế lô, linda xin chào cả nhà'),('minu12021319175851863','minu2','2021-03-20 14:34:25','Ai lớp du chu cà mo'),('minu12021319175851863','minu2','2021-03-20 14:39:10','1'),('minu12021319175851863','minu2','2021-03-20 14:39:20','Ngộ ha'),('minu120213191846393','minu2','2021-03-20 15:50:52','Quỷ gà vàng khè như cục c*c'),('minu12021319184856842','minu2','2021-03-20 17:07:02','Ngủ ngon dữ :vv'),('minu12021319184912769','minu2','2021-03-20 17:06:50','Con đỹ chó =)))'),('minu12021319184912769','minu2','2021-03-20 17:12:23','Nhìn muốn dả dô mặt hết sức');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `followed`
--

DROP TABLE IF EXISTS `followed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `followed` (
  `user_id` varchar(255) NOT NULL,
  `target` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`,`target`),
  KEY `fk_target_user_id` (`target`),
  CONSTRAINT `fk_target_user_id` FOREIGN KEY (`target`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_user_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `followed`
--

LOCK TABLES `followed` WRITE;
/*!40000 ALTER TABLE `followed` DISABLE KEYS */;
INSERT INTO `followed` VALUES ('minu2','minu1'),('minu3','minu1'),('minu1','minu2'),('minu3','minu2'),('minu1','minu3'),('minu2','minu3');
/*!40000 ALTER TABLE `followed` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `post_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `time` datetime NOT NULL,
  PRIMARY KEY (`user_id`,`post_id`,`time`),
  CONSTRAINT `fk_likes_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES ('minu12021319175851863','minu1','2021-03-20 01:55:32'),('minu12021319184626947','minu1','2021-03-20 02:08:30'),('minu120213191846393','minu1','2021-03-20 02:04:02'),('minu12021319184712685','minu1','2021-03-20 02:12:27'),('minu12021319184828632','minu1','2021-03-20 02:09:22'),('minu12021319184842507','minu1','2021-03-20 02:08:08'),('minu12021319184856842','minu1','2021-03-20 01:55:28'),('minu12021319184912769','minu1','2021-03-20 01:55:25'),('minu12021319175851863','minu2','2021-03-20 14:34:38'),('minu12021319184842507','minu2','2021-03-20 02:11:46'),('minu1202131918485028','minu2','2021-03-20 02:11:07'),('minu12021319184856842','minu2','2021-03-20 17:06:57');
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_content`
--

DROP TABLE IF EXISTS `post_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_content` (
  `post_id` varchar(255) DEFAULT NULL,
  `url` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_content`
--

LOCK TABLES `post_content` WRITE;
/*!40000 ALTER TABLE `post_content` DISABLE KEYS */;
INSERT INTO `post_content` VALUES ('minu12021319175851863','/img/post/minu120213191758518630.jpg'),('minu12021319175851863','/img/post/minu120213191758518631.jpg'),('minu12021319175851863','/img/post/minu120213191758518632.jpg'),('minu12021319175851863','/img/post/minu120213191758518633.jpg'),('minu12021319175851863','/img/post/minu120213191758518634.jpg'),('minu12021319184626947','/img/post/minu120213191846269470.jpg'),('minu12021319184626947','/img/post/minu120213191846269471.jpg'),('minu12021319184626947','/img/post/minu120213191846269472.jpg'),('minu12021319184626947','/img/post/minu120213191846269473.jpg'),('minu120213191846393','/img/post/minu1202131918463930.jpg'),('minu12021319184654616','/img/post/minu120213191846546160.jpg'),('minu12021319184654616','/img/post/minu120213191846546161.jpg'),('minu12021319184654616','/img/post/minu120213191846546162.jpg'),('minu12021319184712685','/img/post/minu120213191847126850.jpg'),('minu1202131918489897','/img/post/minu12021319184898970.jpg'),('minu1202131918489897','/img/post/minu12021319184898971.jpg'),('minu1202131918489897','/img/post/minu12021319184898972.jpg'),('minu1202131918489897','/img/post/minu12021319184898973.jpg'),('minu1202131918489897','/img/post/minu12021319184898974.jpg'),('minu12021319184828632','/img/post/minu120213191848286320.jpg'),('minu12021319184828632','/img/post/minu120213191848286321.jpg'),('minu12021319184842507','/img/post/minu120213191848425070.jpg'),('minu1202131918485028','/img/post/minu12021319184850280.jpg'),('minu12021319184856842','/img/post/minu120213191848568420.jpg'),('minu12021319184912769','/img/post/minu120213191849127690.jpg');
/*!40000 ALTER TABLE `post_content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `post_id` varchar(255) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `content` text,
  `post_date` datetime DEFAULT NULL,
  PRIMARY KEY (`post_id`),
  KEY `fk_post_user_token` (`user_id`),
  CONSTRAINT `fk_post_user_token` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES ('minu12021319175851863','minu1','','2021-03-19 17:58:51'),('minu12021319184626947','minu1','','2021-03-19 18:46:26'),('minu120213191846393','minu1','Gà trộm chó','2021-03-19 18:46:39'),('minu12021319184654616','minu1','','2021-03-19 18:46:54'),('minu12021319184712685','minu1','Screaming Pussy cat','2021-03-19 18:47:12'),('minu12021319184828632','minu1','','2021-03-19 18:48:28'),('minu12021319184842507','minu1','Há Lồ :vv','2021-03-19 18:48:42'),('minu1202131918485028','minu1','','2021-03-19 18:48:50'),('minu12021319184856842','minu1','','2021-03-19 18:48:56'),('minu1202131918489897','minu1','','2021-03-19 18:48:09'),('minu12021319184912769','minu1','Con mồn lèo này thặc lạ lz','2021-03-19 18:49:12');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profiles`
--

DROP TABLE IF EXISTS `profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profiles` (
  `user_id` varchar(255) DEFAULT NULL,
  `user_token` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `avatar` text,
  `website` text,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `bio` text,
  PRIMARY KEY (`user_token`),
  KEY `fk_profiles_users` (`user_id`),
  CONSTRAINT `fk_profiles_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles`
--

LOCK TABLES `profiles` WRITE;
/*!40000 ALTER TABLE `profiles` DISABLE KEYS */;
INSERT INTO `profiles` VALUES ('minu3','minu3','Bành Thị Mỹ Nữ','2001-12-29','/img/avatar/minu3.jpg','https://www.facebook.com/huynhvan.cong.58/','minu3@mail.porn.com','0368474601','Bê đê',NULL),('minu1','mynupython','Bành Thị Mị ','2001-12-29','/img/avatar/minu1.jpg','https://www.facebook.com/huynhvan.cong.58/','minu1@mail.porn.com','0368474601','Bê đê',''),('minu2','mynuquaoquo','Bành Thị Mốc ','2001-12-29','/img/avatar/minu2.jpg','https://www.facebook.com/huynhvan.cong.58/','minu2@mail.porn.com','0368474601','Bê đê','');
/*!40000 ALTER TABLE `profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `temp_img`
--

DROP TABLE IF EXISTS `temp_img`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `temp_img` (
  `url` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `temp_img`
--

LOCK TABLES `temp_img` WRITE;
/*!40000 ALTER TABLE `temp_img` DISABLE KEYS */;
/*!40000 ALTER TABLE `temp_img` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('minu1','123'),('minu2','123'),('minu3','123');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-03-20 17:28:29
