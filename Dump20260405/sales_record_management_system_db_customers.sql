-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: sales_record_management_system_db
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (5,'walkin@example.com','Walk-in','Customer','2026-04-04 16:44:22'),(6,'juan.delacruz@example.com','Juan','Dela Cruz','2026-04-04 16:44:22'),(7,'maria.santos@example.com','Maria','Santos','2026-04-04 16:44:22'),(8,'carlo.reyes@example.com','Carlo','Reyes','2026-04-04 16:44:22'),(9,'ana.lopez@example.com','Ana','Lopez','2026-04-04 16:44:22'),(10,'mark.ramos@example.com','Mark','Ramos','2026-04-04 16:44:22'),(11,'bea.cruz@example.com','Bea','Cruz','2026-04-04 16:44:22'),(12,'kevin.flores@example.com','Kevin','Flores','2026-04-04 16:44:22'),(13,'jasmine.garcia@example.com','Jasmine','Garcia','2026-04-04 16:44:22'),(14,'ryan.torres@example.com','Ryan','Torres','2026-04-04 16:44:22'),(15,'nicole.mendoza@example.com','Nicole','Mendoza','2026-04-04 16:44:22'),(16,'angel.bautista@example.com','Angel','Bautista','2026-04-04 16:44:22'),(17,'john.perez@example.com','John','Perez','2026-04-04 16:44:23'),(18,'claire.lim@example.com','Claire','Lim','2026-04-04 16:44:23'),(19,'david.aquino@example.com','David','Aquino','2026-04-04 16:44:23'),(20,'patricia.gomez@example.com','Patricia','Gomez','2026-04-04 16:44:23'),(21,'michael.tan@example.com','Michael','Tan','2026-04-04 16:44:23'),(22,'sophia.lee@example.com','Sophia','Lee','2026-04-04 16:44:23'),(23,'daniel.cruz@example.com','Daniel','Cruz','2026-04-04 16:44:23'),(24,'erika.santos@example.com','Erika','Santos','2026-04-04 16:44:23'),(25,'joshua.ramos@example.com','Joshua','Ramos','2026-04-04 16:44:23'),(26,'mia.torres@example.com','Mia','Torres','2026-04-04 16:44:23'),(27,'ethan.garcia@example.com','Ethan','Garcia','2026-04-04 16:44:23'),(28,'hannah.flores@example.com','Hannah','Flores','2026-04-04 16:44:23'),(29,'nathan.lopez@example.com','Nathan','Lopez','2026-04-04 16:44:23'),(30,'chloe.mendoza@example.com','Chloe','Mendoza','2026-04-04 16:44:23'),(31,'liam.perez@example.com','Liam','Perez','2026-04-04 16:44:23'),(32,'grace.bautista@example.com','Grace','Bautista','2026-04-04 16:44:23'),(33,'sean.aquino@example.com','Sean','Aquino','2026-04-04 16:44:23'),(34,'ella.gomez@example.com','Ella','Gomez','2026-04-04 16:44:23'),(35,'jacob.tan@example.com','Jacob','Tan','2026-04-04 16:44:23'),(36,'zoe.lee@example.com','Zoe','Lee','2026-04-04 16:44:23'),(37,'caleb.cruz@example.com','Caleb','Cruz','2026-04-04 16:44:23'),(38,'faith.santos@example.com','Faith','Santos','2026-04-04 16:44:23'),(39,'lucas.ramos@example.com','Lucas','Ramos','2026-04-04 16:44:23'),(40,'ava.torres@example.com','Ava','Torres','2026-04-04 16:44:23'),(41,'noah.garcia@example.com','Noah','Garcia','2026-04-04 16:44:23'),(42,'lily.flores@example.com','Lily','Flores','2026-04-04 16:44:23'),(43,'gabriel.lopez@example.com','Gabriel','Lopez','2026-04-04 16:44:23'),(44,'scarlett.mendoza@example.com','Scarlett','Mendoza','2026-04-04 16:44:23'),(45,'elijah.perez@example.com','Elijah','Perez','2026-04-04 16:44:23'),(46,'stella.bautista@example.com','Stella','Bautista','2026-04-04 16:44:23'),(47,'isaac.aquino@example.com','Isaac','Aquino','2026-04-04 16:44:23'),(48,'penelope.gomez@example.com','Penelope','Gomez','2026-04-04 16:44:23'),(49,'julian.tan@example.com','Julian','Tan','2026-04-04 16:44:23'),(50,'victoria.lee@example.com','Victoria','Lee','2026-04-04 16:44:23'),(51,'aaron.cruz@example.com','Aaron','Cruz','2026-04-04 16:44:23'),(52,'natalie.santos@example.com','Natalie','Santos','2026-04-04 16:44:23'),(53,'christian.ramos@example.com','Christian','Ramos','2026-04-04 16:44:23'),(54,'samantha.torres@example.com','Samantha','Torres','2026-04-04 16:44:23'),(55,'dominic.garcia@example.com','Dominic','Garcia','2026-04-04 16:44:23');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-05  1:00:06
