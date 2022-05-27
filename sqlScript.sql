CREATE DATABASE  IF NOT EXISTS `sab-exam_beta` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sab-exam_beta`;
-- MySQL dump 10.13  Distrib 8.0.27, for macos11 (x86_64)
--
-- Host: localhost    Database: sab-exam_beta
-- ------------------------------------------------------
-- Server version	8.0.27

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
-- Table structure for table `administrateur`
--

DROP TABLE IF EXISTS `administrateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrateur` (
  `privilege` int NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `FKrbmkav3gk4dak4qrapixqgue1` FOREIGN KEY (`user_id`) REFERENCES `utilisateur` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrateur`
--

LOCK TABLES `administrateur` WRITE;
/*!40000 ALTER TABLE `administrateur` DISABLE KEYS */;
INSERT INTO `administrateur` VALUES (0,1);
/*!40000 ALTER TABLE `administrateur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `affectation_module`
--

DROP TABLE IF EXISTS `affectation_module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `affectation_module` (
  `enseignant_id` bigint NOT NULL,
  `module_id` bigint NOT NULL,
  `affectation_date` datetime(6) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `admin_id` bigint DEFAULT NULL,
  PRIMARY KEY (`enseignant_id`,`module_id`),
  KEY `FK290pxlbcp08o92bq89oryfc` (`admin_id`),
  KEY `FKl26rc60233qp2w4p6tfeiklnt` (`module_id`),
  CONSTRAINT `FK290pxlbcp08o92bq89oryfc` FOREIGN KEY (`admin_id`) REFERENCES `administrateur` (`user_id`),
  CONSTRAINT `FK8imvwaioxuq0onf16uephd7iu` FOREIGN KEY (`enseignant_id`) REFERENCES `enseignant` (`user_id`),
  CONSTRAINT `FKl26rc60233qp2w4p6tfeiklnt` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `affectation_module`
--

LOCK TABLES `affectation_module` WRITE;
/*!40000 ALTER TABLE `affectation_module` DISABLE KEYS */;
INSERT INTO `affectation_module` VALUES (4,3,'2022-05-27 14:57:53.766083','COURSE',1);
/*!40000 ALTER TABLE `affectation_module` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `copie`
--

DROP TABLE IF EXISTS `copie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `copie` (
  `copie_id` bigint NOT NULL,
  `note` float NOT NULL,
  `observation` varchar(255) DEFAULT NULL,
  `etudiant_id` bigint DEFAULT NULL,
  `exam_id` bigint DEFAULT NULL,
  PRIMARY KEY (`copie_id`),
  KEY `FKcjlor1upxjwl8setvrashnvk7` (`etudiant_id`),
  KEY `FK17qr7ipjb42cln2po8oxl2068` (`exam_id`),
  CONSTRAINT `FK17qr7ipjb42cln2po8oxl2068` FOREIGN KEY (`exam_id`) REFERENCES `examen` (`exam_id`),
  CONSTRAINT `FKcjlor1upxjwl8setvrashnvk7` FOREIGN KEY (`etudiant_id`) REFERENCES `etudiant` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `copie`
--

LOCK TABLES `copie` WRITE;
/*!40000 ALTER TABLE `copie` DISABLE KEYS */;
/*!40000 ALTER TABLE `copie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enregistrement`
--

DROP TABLE IF EXISTS `enregistrement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enregistrement` (
  `etudiant_id` bigint NOT NULL,
  `session_id` bigint NOT NULL,
  `url` varchar(255) NOT NULL,
  PRIMARY KEY (`etudiant_id`,`session_id`),
  UNIQUE KEY `UK_86yskxmr11l2gniho9lnx6csn` (`url`),
  KEY `FKafb1047682jjymcfw39p0lsfo` (`session_id`),
  CONSTRAINT `FKafb1047682jjymcfw39p0lsfo` FOREIGN KEY (`session_id`) REFERENCES `session_examen` (`session_id`),
  CONSTRAINT `FKkawmdi4wiawtdiirpx5phnyau` FOREIGN KEY (`etudiant_id`) REFERENCES `etudiant` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enregistrement`
--

LOCK TABLES `enregistrement` WRITE;
/*!40000 ALTER TABLE `enregistrement` DISABLE KEYS */;
/*!40000 ALTER TABLE `enregistrement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enseignant`
--

DROP TABLE IF EXISTS `enseignant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enseignant` (
  `grade` varchar(255) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `FK6svqvr1a0bmpvjgkskvgwsusa` FOREIGN KEY (`user_id`) REFERENCES `utilisateur` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enseignant`
--

LOCK TABLES `enseignant` WRITE;
/*!40000 ALTER TABLE `enseignant` DISABLE KEYS */;
INSERT INTO `enseignant` VALUES ('Class B',4);
/*!40000 ALTER TABLE `enseignant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `etudiant`
--

DROP TABLE IF EXISTS `etudiant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `etudiant` (
  `groupe` int NOT NULL,
  `niveau` varchar(255) NOT NULL,
  `section` int NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `FK464xjmy9tium4rv58br29dfqi` FOREIGN KEY (`user_id`) REFERENCES `utilisateur` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `etudiant`
--

LOCK TABLES `etudiant` WRITE;
/*!40000 ALTER TABLE `etudiant` DISABLE KEYS */;
INSERT INTO `etudiant` VALUES (2,'L3_GL',1,5);
/*!40000 ALTER TABLE `etudiant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `examen`
--

DROP TABLE IF EXISTS `examen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `examen` (
  `exam_id` bigint NOT NULL,
  `date_creation` datetime(6) NOT NULL,
  `is_active` bit(1) NOT NULL,
  `public_info` varchar(255) DEFAULT NULL,
  `module_id` bigint DEFAULT NULL,
  PRIMARY KEY (`exam_id`),
  KEY `FKrtumkd5pafmdbg6pnb4u38b57` (`module_id`),
  CONSTRAINT `FKrtumkd5pafmdbg6pnb4u38b57` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `examen`
--

LOCK TABLES `examen` WRITE;
/*!40000 ALTER TABLE `examen` DISABLE KEYS */;
INSERT INTO `examen` VALUES (10,'2022-05-27 15:45:08.903000',_binary '\0','',3);
/*!40000 ALTER TABLE `examen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `examen_question`
--

DROP TABLE IF EXISTS `examen_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `examen_question` (
  `exam_id` bigint NOT NULL,
  `question_id` bigint NOT NULL,
  `points` float NOT NULL,
  `question_number` int NOT NULL,
  PRIMARY KEY (`exam_id`,`question_id`),
  KEY `FKgm3r5td9bt70myiyfu1hylmcj` (`question_id`),
  CONSTRAINT `FKgm3r5td9bt70myiyfu1hylmcj` FOREIGN KEY (`question_id`) REFERENCES `question` (`question_id`),
  CONSTRAINT `FKnbmj3orl26dmktr532ys1oljg` FOREIGN KEY (`exam_id`) REFERENCES `examen` (`exam_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `examen_question`
--

LOCK TABLES `examen_question` WRITE;
/*!40000 ALTER TABLE `examen_question` DISABLE KEYS */;
INSERT INTO `examen_question` VALUES (10,9,20,0);
/*!40000 ALTER TABLE `examen_question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hibernate_sequence`
--

DROP TABLE IF EXISTS `hibernate_sequence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hibernate_sequence` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hibernate_sequence`
--

LOCK TABLES `hibernate_sequence` WRITE;
/*!40000 ALTER TABLE `hibernate_sequence` DISABLE KEYS */;
INSERT INTO `hibernate_sequence` VALUES (21);
/*!40000 ALTER TABLE `hibernate_sequence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `justification_absence`
--

DROP TABLE IF EXISTS `justification_absence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `justification_absence` (
  `description` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `presences_etudiant_id` bigint NOT NULL,
  `presences_sessionexamen_id` bigint NOT NULL,
  PRIMARY KEY (`presences_etudiant_id`,`presences_sessionexamen_id`),
  CONSTRAINT `FKe62by2bqoijngn1drb5flhirg` FOREIGN KEY (`presences_etudiant_id`, `presences_sessionexamen_id`) REFERENCES `presences` (`etudiant_id`, `sessionexamen_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `justification_absence`
--

LOCK TABLES `justification_absence` WRITE;
/*!40000 ALTER TABLE `justification_absence` DISABLE KEYS */;
/*!40000 ALTER TABLE `justification_absence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `module`
--

DROP TABLE IF EXISTS `module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `module` (
  `id` bigint NOT NULL,
  `coefficient` int NOT NULL,
  `hastdtp` bit(1) NOT NULL,
  `module_abrv` varchar(255) NOT NULL,
  `niveau` varchar(255) NOT NULL,
  `nom_module` varchar(255) NOT NULL,
  `admin_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_m5ucu7cagfyejsvfgq4degp5g` (`module_abrv`),
  KEY `FKq6yb6bucfhgjy024fysp56l65` (`admin_id`),
  CONSTRAINT `FKq6yb6bucfhgjy024fysp56l65` FOREIGN KEY (`admin_id`) REFERENCES `administrateur` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `module`
--

LOCK TABLES `module` WRITE;
/*!40000 ALTER TABLE `module` DISABLE KEYS */;
INSERT INTO `module` VALUES (3,101,_binary '','CS_101','L3_GL','Cyber Security',1);
/*!40000 ALTER TABLE `module` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `planning_examen`
--

DROP TABLE IF EXISTS `planning_examen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `planning_examen` (
  `plan_id` bigint NOT NULL,
  `code_etudiant` varchar(255) NOT NULL,
  `code_surveillant` varchar(255) NOT NULL,
  `date_of_exame` datetime(6) NOT NULL,
  `duration` bigint NOT NULL,
  `admin_id` bigint DEFAULT NULL,
  `module_id` bigint DEFAULT NULL,
  PRIMARY KEY (`plan_id`),
  UNIQUE KEY `UK_c057p8ei9ds8ex1stjq6to709` (`code_etudiant`),
  UNIQUE KEY `UK_c4ntf7k25lhwj1lpfvuehfg4j` (`code_surveillant`),
  KEY `FKlx26x7dwlanitfn38n9gn5ae0` (`admin_id`),
  KEY `FK1yp499ysdmlm5hw6mexnc1dhw` (`module_id`),
  CONSTRAINT `FK1yp499ysdmlm5hw6mexnc1dhw` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`),
  CONSTRAINT `FKlx26x7dwlanitfn38n9gn5ae0` FOREIGN KEY (`admin_id`) REFERENCES `administrateur` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planning_examen`
--

LOCK TABLES `planning_examen` WRITE;
/*!40000 ALTER TABLE `planning_examen` DISABLE KEYS */;
INSERT INTO `planning_examen` VALUES (6,'33528571-fa14-406d-8f36-b8a97d76a817','b4cf732e-4bb6-48ac-b632-e9aeb9b45355','2022-05-28 09:30:00.000000',3600000,1,3);
/*!40000 ALTER TABLE `planning_examen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `planning_examen_etudiants`
--

DROP TABLE IF EXISTS `planning_examen_etudiants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `planning_examen_etudiants` (
  `plan_id` bigint NOT NULL,
  `etudiant_id` bigint NOT NULL,
  KEY `FKrej6ilb7qlnnnxuc4vxvdjgp2` (`etudiant_id`),
  KEY `FK2bmfspyl5yw1hovejdf49mpyp` (`plan_id`),
  CONSTRAINT `FK2bmfspyl5yw1hovejdf49mpyp` FOREIGN KEY (`plan_id`) REFERENCES `planning_examen` (`plan_id`),
  CONSTRAINT `FKrej6ilb7qlnnnxuc4vxvdjgp2` FOREIGN KEY (`etudiant_id`) REFERENCES `etudiant` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planning_examen_etudiants`
--

LOCK TABLES `planning_examen_etudiants` WRITE;
/*!40000 ALTER TABLE `planning_examen_etudiants` DISABLE KEYS */;
INSERT INTO `planning_examen_etudiants` VALUES (6,5);
/*!40000 ALTER TABLE `planning_examen_etudiants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `presences`
--

DROP TABLE IF EXISTS `presences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `presences` (
  `etudiant_id` bigint NOT NULL,
  `sessionexamen_id` bigint NOT NULL,
  `justification` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`etudiant_id`,`sessionexamen_id`),
  KEY `FKc12uq77c0sukmo2nbaw9jauk6` (`sessionexamen_id`),
  CONSTRAINT `FKc12uq77c0sukmo2nbaw9jauk6` FOREIGN KEY (`sessionexamen_id`) REFERENCES `session_examen` (`session_id`),
  CONSTRAINT `FKdlh0xspiwi6rbyv68glibviqi` FOREIGN KEY (`etudiant_id`) REFERENCES `etudiant` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `presences`
--

LOCK TABLES `presences` WRITE;
/*!40000 ALTER TABLE `presences` DISABLE KEYS */;
INSERT INTO `presences` VALUES (5,7,NULL,'PRESENT');
/*!40000 ALTER TABLE `presences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proces_sur_enregistrement`
--

DROP TABLE IF EXISTS `proces_sur_enregistrement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proces_sur_enregistrement` (
  `date_of_review` datetime(6) NOT NULL,
  `has_cheated` bit(1) NOT NULL,
  `observation` varchar(255) DEFAULT NULL,
  `enregistrement_etudiant_id` bigint NOT NULL,
  `enregistrement_session_id` bigint NOT NULL,
  PRIMARY KEY (`enregistrement_etudiant_id`,`enregistrement_session_id`),
  CONSTRAINT `FKdp268toao8s5ar5rohmlrs57l` FOREIGN KEY (`enregistrement_etudiant_id`, `enregistrement_session_id`) REFERENCES `enregistrement` (`etudiant_id`, `session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proces_sur_enregistrement`
--

LOCK TABLES `proces_sur_enregistrement` WRITE;
/*!40000 ALTER TABLE `proces_sur_enregistrement` DISABLE KEYS */;
/*!40000 ALTER TABLE `proces_sur_enregistrement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proces_sur_session`
--

DROP TABLE IF EXISTS `proces_sur_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proces_sur_session` (
  `notify` bit(1) NOT NULL,
  `obsevation` varchar(255) DEFAULT NULL,
  `session_examen_session_id` bigint NOT NULL,
  PRIMARY KEY (`session_examen_session_id`),
  CONSTRAINT `FKt5bbyo5pycx77bg3u99cka9dn` FOREIGN KEY (`session_examen_session_id`) REFERENCES `session_examen` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proces_sur_session`
--

LOCK TABLES `proces_sur_session` WRITE;
/*!40000 ALTER TABLE `proces_sur_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `proces_sur_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question` (
  `question_id` bigint NOT NULL,
  `content` longtext NOT NULL,
  `date_creation` datetime(6) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `nbr_occurrences` int NOT NULL,
  `nbr_ratings` int NOT NULL,
  `points` int NOT NULL,
  `rating` float NOT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `type_answer` longtext NOT NULL,
  `enseignant_id` bigint DEFAULT NULL,
  `module_id` bigint DEFAULT NULL,
  PRIMARY KEY (`question_id`),
  KEY `FKjgybkva225fujrm1vios45l62` (`enseignant_id`),
  KEY `FKfufvqplxial9vbjcmo4l5tx8h` (`module_id`),
  CONSTRAINT `FKfufvqplxial9vbjcmo4l5tx8h` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`),
  CONSTRAINT `FKjgybkva225fujrm1vios45l62` FOREIGN KEY (`enseignant_id`) REFERENCES `enseignant` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES (9,'<p>1- What is SQL Injection in details&nbsp;</p><figure class=\"image\"><img src=\"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAUDBAgICggICAgJCQgGBwgICAcHCAkICAgICAgHCAgICAgIChALCAgOCQgIDRUNDhERExMTCAsWGBYSGBASExIBBQUFCAcIDgkJDxIPEBASEhISEhIWExISEhISEhIVEhISEhUWEhISEhISEhISEhISEhISEhISEhISEhISEhISEv/AABEIAWgB4AMBIgACEQEDEQH/xAAdAAEAAQUBAQEAAAAAAAAAAAAABwECBQYIAwQJ/8QAUxAAAQQBAQQFCgMEBgYEDwAAAQACAwQFEQYSEyEHFjFT0ggUIkFRYXGBk6MVMpEjcoKxJDNCUpKhNkNiY3ODJTREshcYNUVUVXR1lKK0tcHT8f/EABoBAQACAwEAAAAAAAAAAAAAAAACAwEEBQb/xAA4EQACAQIBCQcDBAICAwEAAAAAAQIDESEEEhQVMVFSkaEFEzJBYXHRgcHwIkJysYLhJDNiovEj/9oADAMBAAIRAxEAPwDjJERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQGe6p5DuB9WLxp1TyHcD6sXjUoovUalo75dDy2vK26PX5Iu6p5DuB9WLxp1TyHcD6sXjUoompaO+XQa8rbo9fki7qnkO4H1YvGnVPIdwPqxeNSiialo75dBrytuj1+SLuqeQ7gfVi8adU8h3A+rF41KKJqWjvl0GvK26PX5Iu6p5DuB9WLxp1TyHcD6sXjUoompaO+XQa8rbo9fki7qnkO4H1YvGnVPIdwPqxeNSiialo75dBrytuj1+SLuqeQ7gfVi8adU8h3A+rF41KKJqWjvl0GvK26PX5Iu6p5DuB9WLxp1TyHcD6sXjUoompaO+XQa8rbo8n8kXdU8h3A+rF406p5DuB9W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\"><figcaption>Hint</figcaption></figure>','2022-05-27 15:44:22.664000','security question',0,0,0,0,NULL,'<p>1- it\' something bad which you can make it on this website ?</p>',4,3);
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reclamation`
--

DROP TABLE IF EXISTS `reclamation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reclamation` (
  `claim_id` bigint NOT NULL,
  `claim_type` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `copie_id` bigint DEFAULT NULL,
  PRIMARY KEY (`claim_id`),
  KEY `FKlvd5sc2x6gcxtws9jyiluxnph` (`copie_id`),
  CONSTRAINT `FKlvd5sc2x6gcxtws9jyiluxnph` FOREIGN KEY (`copie_id`) REFERENCES `copie` (`copie_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reclamation`
--

LOCK TABLES `reclamation` WRITE;
/*!40000 ALTER TABLE `reclamation` DISABLE KEYS */;
/*!40000 ALTER TABLE `reclamation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reponse`
--

DROP TABLE IF EXISTS `reponse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reponse` (
  `reponse_id` bigint NOT NULL,
  `content` longtext,
  `points` float NOT NULL,
  `copie_id` bigint DEFAULT NULL,
  `question_exam_id` bigint DEFAULT NULL,
  `question_question_id` bigint DEFAULT NULL,
  PRIMARY KEY (`reponse_id`),
  KEY `FK3w4ki8qqwuqbsstwto2y96tfe` (`copie_id`),
  KEY `FKdrsvvkn59t69wf1i7ddvdtmcn` (`question_exam_id`,`question_question_id`),
  CONSTRAINT `FK3w4ki8qqwuqbsstwto2y96tfe` FOREIGN KEY (`copie_id`) REFERENCES `copie` (`copie_id`),
  CONSTRAINT `FKdrsvvkn59t69wf1i7ddvdtmcn` FOREIGN KEY (`question_exam_id`, `question_question_id`) REFERENCES `examen_question` (`exam_id`, `question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reponse`
--

LOCK TABLES `reponse` WRITE;
/*!40000 ALTER TABLE `reponse` DISABLE KEYS */;
/*!40000 ALTER TABLE `reponse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session_examen`
--

DROP TABLE IF EXISTS `session_examen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `session_examen` (
  `session_id` bigint NOT NULL,
  `state` varchar(255) DEFAULT NULL,
  `planning_id` bigint DEFAULT NULL,
  `surveillant_id` bigint DEFAULT NULL,
  PRIMARY KEY (`session_id`),
  KEY `FK9sg9r14n30fcmrc8lps4xw9n7` (`planning_id`),
  KEY `FKg0v3qercycaqcjos1euate1tb` (`surveillant_id`),
  CONSTRAINT `FK9sg9r14n30fcmrc8lps4xw9n7` FOREIGN KEY (`planning_id`) REFERENCES `planning_examen` (`plan_id`),
  CONSTRAINT `FKg0v3qercycaqcjos1euate1tb` FOREIGN KEY (`surveillant_id`) REFERENCES `enseignant` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session_examen`
--

LOCK TABLES `session_examen` WRITE;
/*!40000 ALTER TABLE `session_examen` DISABLE KEYS */;
INSERT INTO `session_examen` VALUES (7,'STARTED',6,4);
/*!40000 ALTER TABLE `session_examen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur` (
  `user_id` bigint NOT NULL,
  `email` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `url_profile` varchar(255) DEFAULT NULL,
  `user_role` varchar(255) NOT NULL,
  `admin_id` bigint DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UK_rma38wvnqfaf66vvmi57c71lo` (`email`),
  UNIQUE KEY `UK_q6ld7tf2l0nnbvq0iqc0i97uu` (`url_profile`),
  KEY `FKol7onpv9h3p3d1x0nh9kptwal` (`admin_id`),
  CONSTRAINT `FKol7onpv9h3p3d1x0nh9kptwal` FOREIGN KEY (`admin_id`) REFERENCES `administrateur` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur`
--

LOCK TABLES `utilisateur` WRITE;
/*!40000 ALTER TABLE `utilisateur` DISABLE KEYS */;
INSERT INTO `utilisateur` VALUES (1,'lrvjbDV5FCaME/ZuxTn1A/bkBzDrpJLV/ijs40YkzSc=','KOfiQ4V2JWNCTio6mvOvCw==','2Azcmp5NHkOIHGDkfrnQmw==','$2y$10$rXGmYOt.IF3k3RxVpjh6HOG3a5nzpyUqSFlPDYrkuWkew5qqUnE7S',NULL,'WUBOoGzIblKRMegWELmvFw==',NULL),(4,'GeGfBxrgI6VNEkBqdPnvjbY3tfj8zw2wOjLd416h2rForlxU0e0JoYRkN+Ax4H2c','yT040vNA2bwyLzzT2NfReA==','lc4ZEKSukTNBe2AlV7ytnw==','$2a$10$ET3sn29lsLO1jYl9vVWWGOaT75eql4uVthhBOIMy79.4Db4VZG/6q',NULL,'KnMILMqAp7yeS0JO19t6cg==',1),(5,'Rszn8GZfTjNNS+5uaedXkb9DnVUnD7ZVmHn/G1hzcl4=','BSv/5dRy9ILJ3YVsW2q3vg==','WmRxfd8vQBAh+2xG+vAbBA==','$2a$10$Tg/sx59U7kQ4JnAK5YC5hukAU/dW.Dt8.NmCCzTMI623JlErtiYVy',NULL,'AIawzGEjweg3sejWF64LPw==',1);
/*!40000 ALTER TABLE `utilisateur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'sab-exam_beta'
--

--
-- Dumping routines for database 'sab-exam_beta'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-27 16:06:18
