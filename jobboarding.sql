-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 01, 2023 at 08:08 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jobboarding`
--

-- --------------------------------------------------------

--
-- Table structure for table `chats`
--

CREATE TABLE `chats` (
  `id` int(11) NOT NULL,
  `user` varchar(170) NOT NULL,
  `to` varchar(170) NOT NULL,
  `msg` varchar(300) NOT NULL,
  `sender` varchar(70) NOT NULL,
  `time` time NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `chats`
--

INSERT INTO `chats` (`id`, `user`, `to`, `msg`, `sender`, `time`) VALUES
(16, 'savaliyamehul95@gmail.com', 'svlmehul@gmail.com', 'Henlo\nSir', 'savaliyamehul95@gmail.com', '14:37:02'),
(21, 'svlmehul@gmail.com', 'savaliyamehul95@gmail.com', 'cp to user', 'svlmehul@gmail.com', '15:25:12'),
(24, 'savaliyamehul95@gmail.com', 'test@gmail.com', 'Henlo simr', 'savaliyamehul95@gmail.com', '10:30:42'),
(25, 'test@gmail.com', 'savaliyamehul95@gmail.com', 'Testcp To ms user', 'test@gmail.com', '00:00:00'),
(27, 'unknown@gmail.com', 'savaliyamehul95@gmail.com', 'Unknown to msuser', 'unknown@gmail.com', '00:00:00'),
(30, 'savaliyamehul95@gmail.com', 'svlmehul@gmail.com', 'henlo again', 'savaliyamehul95@gmail.com', '10:57:51'),
(31, 'savaliyamehul95@gmail.com', 'svlmehul@gmail.com', 'j', 'savaliyamehul95@gmail.com', '10:58:35'),
(34, 'savaliyamehul95@gmail.com', 'test@gmail.com', 'Henlo sirms', 'savaliyamehul95@gmail.com', '11:00:57'),
(39, 'savaliyamehul95@gmail.com', 'test@gmail.com', 'Henlo Sirm Here to Ask Abput Assadin', 'savaliyamehul95@gmail.com', '15:50:25'),
(40, 'savaliyamehul95@gmail.com', 'svlmehul@gmail.com', 'sgsggs', 'savaliyamehul95@gmail.com', '17:59:23'),
(41, 'svlmehul@gmail.com', 'savaliyamehul95@gmail.com', 'fff', 'svlmehul@gmail.com', '22:29:52'),
(42, 'svlmehul@gmail.com', 'savaliyamehul95@gmail.com', 'share something useful if possible', 'svlmehul@gmail.com', '22:39:51'),
(43, 'savaliyamehul95@gmail.com', 'svlmehul@gmail.com', 'waimt', 'savaliyamehul95@gmail.com', '22:41:51'),
(44, 'svlmehul@gmail.com', 'savaliyamehul95@gmail.com', 'ok ', 'svlmehul@gmail.com', '22:42:10'),
(45, 'savaliyamehul95@gmail.com', 'svlmehul@gmail.com', 'Heelo 222', 'savaliyamehul95@gmail.com', '12:19:24'),
(46, 'svlmehul@gmail.com', 'savaliyamehul95@gmail.com', 'hello 333', 'svlmehul@gmail.com', '12:19:33'),
(47, 'svlmehul@gmail.com', 'savaliyamehul95@gmail.com', 'Hello MS', 'svlmehul@gmail.com', '12:34:57'),
(48, 'savaliyamehul95@gmail.com', 'svlmehul@gmail.com', '1', 'savaliyamehul95@gmail.com', '12:36:11'),
(49, 'savaliyamehul95@gmail.com', 'svlmehul@gmail.com', '12', 'savaliyamehul95@gmail.com', '12:36:15'),
(50, 'svlmehul@gmail.com', 'savaliyamehul95@gmail.com', 'hello son', 'svlmehul@gmail.com', '21:47:00'),
(51, 'svlmehul@gmail.com', 'savaliyamehul95@gmail.com', 'hello son', 'svlmehul@gmail.com', '21:47:01'),
(52, 'savaliyamehul95@gmail.com', 'svlmehul@gmail.com', 'hello', 'savaliyamehul95@gmail.com', '21:47:19'),
(53, 'svlmehul@gmail.com', 'savaliyamehul95@gmail.com', 'heelo', 'svlmehul@gmail.com', '21:48:34'),
(54, 'asfasdf@asdf', 'savaliyamehul95@gmail.com', 'HELLO, MEHUL EXCITED TO GET YOU ONBOARD!', 'asfasdf@asdf', '09:04:10'),
(55, 'savaliyamehul95@gmail.com', 'asfasdf@asdf', 'helo ', 'savaliyamehul95@gmail.com', '09:04:27'),
(56, 'svlmehul@gmail.com', 'cheems@cheems', 'hello cheems', 'svlmehul@gmail.com', '13:32:49'),
(57, 'cheems@cheems', 'svlmehul@gmail.com', 'hello sir', 'cheems@cheems', '13:33:36'),
(58, 'savaliyamehul95@gmail.com', 'svlmehul@gmail.com', 'avskjdv ksjd vksjd vksjd vksdj v', 'savaliyamehul95@gmail.com', '19:40:39');

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `id` int(10) NOT NULL,
  `fname` varchar(50) NOT NULL,
  `lname` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `url` varchar(50) NOT NULL,
  `bshr` blob NOT NULL,
  `addr` varchar(100) NOT NULL,
  `size` int(250) NOT NULL,
  `email` varchar(80) NOT NULL,
  `phone` varchar(13) NOT NULL,
  `pass` varchar(50) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `jobs` varchar(10000) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{}|',
  `canjobs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`canjobs`)),
  `review` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`id`, `fname`, `lname`, `name`, `url`, `bshr`, `addr`, `size`, `email`, `phone`, `pass`, `active`, `jobs`, `canjobs`, `review`) VALUES
(24, 'Mehul', 'Savaliya', 'MS Corp', 'http://localhost:5555/registercmpny', '', 'GJ14,IND', 300, 'svlmehul@gmail.com', '1234567890', 'svlmehul@gmail.com', 1, '{}|', NULL, NULL),
(28, 'test', 'test', 'testchat', 'https://www.google.com', '', 'test', 700, 'test@gmail.com', '777', 'test@gmail.com', 1, '{}|', NULL, NULL),
(31, '', '', '', '', '', '', 0, '', '', '', 1, '{}|', NULL, NULL),
(32, '1', '2', '3', '4', '', '5', 6, '77@77', '1472583', '77@77', 1, '{}|', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cpmedia`
--

CREATE TABLE `cpmedia` (
  `id` int(11) NOT NULL,
  `email` varchar(70) NOT NULL,
  `pass` varchar(50) NOT NULL,
  `profile` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cpmedia`
--

INSERT INTO `cpmedia` (`id`, `email`, `pass`, `profile`) VALUES
(22, 'svlmehul@gmail.com', 'svlmehul@gmail.com', './public/cpupload/pp/pp_1676190898686_MS Corp_1234567890.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `interview`
--

CREATE TABLE `interview` (
  `id` int(11) NOT NULL,
  `jsemail` varchar(70) NOT NULL,
  `jsphone` varchar(12) NOT NULL,
  `ttl` varchar(50) NOT NULL,
  `cpemail` varchar(80) NOT NULL,
  `cpphone` varchar(12) NOT NULL,
  `location` varchar(300) NOT NULL,
  `hr` varchar(70) NOT NULL,
  `hr_email` varchar(70) NOT NULL,
  `hr_phone` varchar(12) NOT NULL,
  `date` varchar(10) NOT NULL,
  `time` varchar(6) NOT NULL,
  `extradetails` varchar(300) NOT NULL,
  `req_doc` varchar(70) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `interview`
--

INSERT INTO `interview` (`id`, `jsemail`, `jsphone`, `ttl`, `cpemail`, `cpphone`, `location`, `hr`, `hr_email`, `hr_phone`, `date`, `time`, `extradetails`, `req_doc`) VALUES
(49, 'savaliyamehul95@gmail.com', '9510754137', 'Software Engineer', 'svlmehul@gmail.com', '1234567890', '1', '111', 'svlmehul@gmail.com', '1111', '2023-03-04', '12:28', '11111', '11'),
(50, 'cheems@cheems', '12345', 'Software Engineer', 'svlmehul@gmail.com', '1234567890', '2', '222', 'svlmehul@gmail.com', '2222', '2023-03-04', '12:28', '22222', '2');

-- --------------------------------------------------------

--
-- Table structure for table `jobseeker`
--

CREATE TABLE `jobseeker` (
  `id` int(10) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(13) NOT NULL,
  `resume` varchar(100) DEFAULT NULL,
  `coverletter` varchar(100) DEFAULT NULL,
  `data` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `jobseeker`
--

INSERT INTO `jobseeker` (`id`, `firstname`, `lastname`, `email`, `phone`, `resume`, `coverletter`, `data`, `active`, `password`) VALUES
(71, 'Mehul', 'Savaliya', 'savaliyamehul95@gmail.com', '9510754137', 'undefined', 'undefined', '{\"fname\":\"Mehul\",\"lname\":\"Savaliya\",\"email\":\"savaliyamehul95@gmail.com\",\"phone\":\"9510754137\",\"active\":true,\"password\":\"savaliyamehul95@gmail.com\",\"pro', 1, 'savaliyamehul95@gmail.com'),
(75, 'cheems', 'levi', 'cheems@cheems', '12345', 'undefined', 'undefined', '{\"fname\":\"cheems\",\"lname\":\"levi\",\"email\":\"cheems@cheems\",\"phone\":\"12345\",\"active\":true,\"password\":\"cheems@cheems\",\"profile\":\"./static/img/userprofile.', 1, 'cheems@cheems'),
(76, '1', '1', '1', '1', 'undefined', 'undefined', '{\"fname\":\"1\",\"lname\":\"1\",\"email\":\"1\",\"phone\":\"1\",\"active\":true,\"password\":\"1\",\"profile\":\"./static/img/userprofile.webp\"}', 1, '1'),
(77, 'MS', 'X85', 'rr@rr', '123456789', 'undefined', 'undefined', '{\"fname\":\"MS\",\"lname\":\"X85\",\"email\":\"rr@rr\",\"phone\":\"123456789\",\"active\":true,\"password\":\"rr@rr\",\"profile\":\"./static/img/userprofile.webp\"}', 1, 'rr@rr'),
(79, 'aaa', 'sss', 'as', 'aaa', 'undefined', 'undefined', '{\"fname\":\"aaa\",\"lname\":\"sss\",\"email\":\"as\",\"phone\":\"aaa\",\"active\":true,\"password\":\"aa\",\"profile\":\"./static/img/userprofile.webp\"}', 1, 'aa');

-- --------------------------------------------------------

--
-- Table structure for table `jobsx`
--

CREATE TABLE `jobsx` (
  `idx` int(10) NOT NULL,
  `cpname` varchar(50) DEFAULT NULL,
  `jobttl` varchar(50) DEFAULT NULL,
  `cpemail` varchar(50) DEFAULT NULL,
  `uemail` varchar(80) NOT NULL,
  `responses` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `datetime` varchar(20) NOT NULL,
  `accepted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `jobsx`
--

INSERT INTO `jobsx` (`idx`, `cpname`, `jobttl`, `cpemail`, `uemail`, `responses`, `datetime`, `accepted`) VALUES
(155, 'MS Corp', '1', 'svlmehul@gmail.com', 'savaliyamehul95@gmail.com', '{\"fname\":\"Mehul\",\"lname\":\"Savaliya\",\"email\":\"savaliyamehul95@gmail.com\",\"phone\":\"9510754137\",\"password\":\"savaliyamehul95@gmail.com\"}', '1680242493088', 0),
(156, 'MS Corp', 'test3', 'svlmehul@gmail.com', 'savaliyamehul95@gmail.com', '{\"fname\":\"Mehul\",\"lname\":\"Savaliya\",\"email\":\"savaliyamehul95@gmail.com\",\"phone\":\"9510754137\",\"password\":\"savaliyamehul95@gmail.com\"}', '1680242504282', 0),
(158, 'MS Corp', '1', 'svlmehul@gmail.com', 'cheems@cheems', '{\"fname\":\"cheems\",\"lname\":\"levi\",\"email\":\"cheems@cheems\",\"phone\":\"12345\",\"password\":\"cheems@cheems\"}', '1680371859993', 0);

-- --------------------------------------------------------

--
-- Table structure for table `postedjobs`
--

CREATE TABLE `postedjobs` (
  `id` int(11) NOT NULL,
  `cpname` varchar(50) NOT NULL,
  `cpemail` varchar(70) NOT NULL,
  `cppass` varchar(70) NOT NULL,
  `ttl` varchar(20) NOT NULL,
  `job` varchar(300) NOT NULL,
  `file` varchar(100) NOT NULL,
  `pstr` varchar(100) NOT NULL,
  `datetime` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `postedjobs`
--

INSERT INTO `postedjobs` (`id`, `cpname`, `cpemail`, `cppass`, `ttl`, `job`, `file`, `pstr`, `datetime`) VALUES
(82, 'MS Corp', 'svlmehul@gmail.com', 'svlmehul@gmail.com', '1', '{\"pjttl\":\"1\",\"pjemail\":\"svlmehul@gmail.com\",\"pjsalary\":\"1\",\"pjdisc\":\"\n       1     \",\"datetime\":\"1676995778894\",\"pjcpname\":\"MS Corp\",\"gender\":\"male\"}', '/public/cpupload/jobmedia/1dce6f9a7b7e6c839609e831a3fb283a66f15a6c.jpeg', '/public/cpupload/jobmedia/1dce6f9a7b7e6c839609e831a3fb283a66f15a6c.pdf', '1676995778894'),
(84, 'MS Corp', 'svlmehul@gmail.com', 'svlmehul@gmail.com', 'test1', '{\"pjttl\":\"test1\",\"pjemail\":\"svlmehul@gmail.com\",\"pjsalary\":\"111111\",\"pjdisc\":\"f\nf\nf\nf\n\n            \",\"datetime\":\"1679579951890\",\"pjcpname\":\"MS Corp\",\"gender\":\"male\"}', '/public/cpupload/jobmedia/4669ab163ecb7bfce018748c200adaa032809648.png', '/public/cpupload/jobmedia/4669ab163ecb7bfce018748c200adaa032809648.pdf', '1679579951890'),
(86, 'MS Corp', 'svlmehul@gmail.com', 'svlmehul@gmail.com', 'test3', '{\"pjttl\":\"test3\",\"pjemail\":\"svlmehul@gmail.com\",\"pjsalary\":\"333333\",\"pjdisc\":\"f\nf\nflrkn\nadblndf\nbadfbn\n\nf\n\n            \",\"datetime\":\"1679580406611\",\"pjcpname\":\"MS Corp\",\"gender\":\"male\"}', '/public/cpupload/jobmedia/ccbfb3d07c85f4bd4d52f10fdb3aa8b1d1fd71ef.jpeg', '/public/cpupload/jobmedia/ccbfb3d07c85f4bd4d52f10fdb3aa8b1d1fd71ef.pdf', '1679580406611'),
(111, 'testchat', 'test@gmail.com', 'test@gmail.com', 'SDE', '{\"pjcpname\":\"testchat\",\"pjemail\":\"test@gmail.com\",\"gender\":\"Male\",\"pjsalary\":\"100000\",\"pjttl\":\"SDE\",\"pjdisc\":\"test@gmail.com\r\ntest@gmail.com\r\ntest@gmail.com\"}', '/public/cpupload/jobmedia/e19801325c7ce5a16cef13b0f9087ed7ce3dbe5c.jpg', '/public/cpupload/jobmedia/e19801325c7ce5a16cef13b0f9087ed7ce3dbe5c.pdf', '1680368507499');

-- --------------------------------------------------------

--
-- Table structure for table `usermedia`
--

CREATE TABLE `usermedia` (
  `indx` int(11) NOT NULL,
  `email` varchar(70) NOT NULL,
  `pass` varchar(70) NOT NULL,
  `resume` varchar(90) NOT NULL,
  `profile` varchar(90) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `usermedia`
--

INSERT INTO `usermedia` (`indx`, `email`, `pass`, `resume`, `profile`) VALUES
(19, 'savaliyamehul95@gmail.com', 'savaliyamehul95@gmail.com', './public/userupload/resume/resm_1676651201159_Savaliya_9510754137.pdf', './public/userupload/pp/pp_1676651201159_Savaliya_9510754137.jpeg'),
(22, 'cheems@cheems', 'cheems@cheems', './public/userupload/resume/resm_1677131590686_levi_12345.pdf', './public/userupload/pp/pp_1677131590686_levi_12345.png');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cpmedia`
--
ALTER TABLE `cpmedia`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `interview`
--
ALTER TABLE `interview`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jobseeker`
--
ALTER TABLE `jobseeker`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jobsx`
--
ALTER TABLE `jobsx`
  ADD PRIMARY KEY (`idx`);

--
-- Indexes for table `postedjobs`
--
ALTER TABLE `postedjobs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `usermedia`
--
ALTER TABLE `usermedia`
  ADD PRIMARY KEY (`indx`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `chats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `cpmedia`
--
ALTER TABLE `cpmedia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `interview`
--
ALTER TABLE `interview`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `jobseeker`
--
ALTER TABLE `jobseeker`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT for table `jobsx`
--
ALTER TABLE `jobsx`
  MODIFY `idx` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=160;

--
-- AUTO_INCREMENT for table `postedjobs`
--
ALTER TABLE `postedjobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT for table `usermedia`
--
ALTER TABLE `usermedia`
  MODIFY `indx` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
