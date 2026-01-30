-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 29, 2026 at 06:54 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `health_coach_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `dish_library`
--

CREATE TABLE `dish_library` (
  `id` bigint(20) NOT NULL,
  `base_calories` int(11) DEFAULT NULL,
  `category` enum('BREAKFAST','DINNER','LUNCH','SNACK') DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_ai_suggested` bit(1) DEFAULT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  `is_verified` bit(1) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `unit` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dish_library`
--

INSERT INTO `dish_library` (`id`, `base_calories`, `category`, `created_at`, `description`, `is_ai_suggested`, `is_deleted`, `is_verified`, `name`, `unit`) VALUES
(1, 450, 'BREAKFAST', '2026-01-27 16:00:12.000000', 'Phở bò tái chín với nước dùng ninh xương đậm đà', b'0', b'0', b'1', 'Phở bò', 'bát'),
(2, 400, 'BREAKFAST', '2026-01-27 16:00:12.000000', 'Phở gà ta thịt dai ngọt, nước dùng thanh nhẹ', b'0', b'0', b'1', 'Phở gà', 'bát'),
(3, 500, 'BREAKFAST', '2026-01-27 16:00:12.000000', 'Bún chả Hà Nội nướng than hoa thơm lừng', b'0', b'0', b'1', 'Bún chả', 'suất'),
(4, 480, 'BREAKFAST', '2026-01-27 16:00:12.000000', 'Bún bò Huế cay nồng, chân giò heo và chả cua', b'0', b'0', b'1', 'Bún bò Huế', 'bát'),
(5, 350, 'BREAKFAST', '2026-01-27 16:00:12.000000', 'Bánh mì kẹp thịt nướng, pate và rau sống', b'0', b'0', b'1', 'Bánh mì thịt', 'cái'),
(6, 300, 'BREAKFAST', '2026-01-27 16:00:12.000000', 'Bánh mì ốp la đơn giản, giàu năng lượng', b'0', b'0', b'1', 'Bánh mì trứng', 'cái'),
(7, 450, 'BREAKFAST', '2026-01-27 16:00:12.000000', 'Xôi xéo đậu xanh hành phi mỡ gà béo ngậy', b'0', b'0', b'1', 'Xôi xéo', 'gói'),
(8, 500, 'BREAKFAST', '2026-01-27 16:00:12.000000', 'Xôi nếp dẻo ăn kèm thịt gà xé phay', b'0', b'0', b'1', 'Xôi gà', 'gói'),
(9, 350, 'BREAKFAST', '2026-01-27 16:00:12.000000', 'Bánh cuốn nhân thịt mộc nhĩ chấm nước mắm', b'0', b'0', b'1', 'Bánh cuốn', 'đĩa'),
(10, 300, 'BREAKFAST', '2026-01-27 16:00:12.000000', 'Bánh giò nóng hổi nhân thịt băm mộc nhĩ', b'0', b'0', b'1', 'Bánh giò', 'cái'),
(11, 350, 'BREAKFAST', '2026-01-27 16:00:12.000000', 'Cháo lòng heo đầy đủ dinh dưỡng', b'0', b'0', b'1', 'Cháo lòng', 'bát'),
(12, 300, 'BREAKFAST', '2026-01-27 16:00:12.000000', 'Cháo gà hạt sen bổ dưỡng, dễ tiêu hóa', b'0', b'0', b'1', 'Cháo gà', 'bát'),
(13, 350, 'BREAKFAST', '2026-01-27 16:00:12.000000', 'Mì gói nấu trứng chần nhanh gọn', b'0', b'0', b'1', 'Mì tôm trứng', 'bát'),
(14, 400, 'BREAKFAST', '2026-01-27 16:00:12.000000', 'Bún riêu cua đồng vị chua thanh mát', b'0', b'0', b'1', 'Bún riêu cua', 'bát'),
(15, 380, 'BREAKFAST', '2026-01-27 16:00:12.000000', 'Bún mọc viên giòn dai, nước dùng ngọt thanh', b'0', b'0', b'1', 'Bún mọc', 'bát'),
(16, 550, 'BREAKFAST', '2026-01-27 16:00:12.000000', 'Bánh mì chảo thập cẩm xúc xích pate', b'0', b'0', b'1', 'Bánh mì chảo', 'suất'),
(17, 350, 'BREAKFAST', '2026-01-27 16:00:12.000000', 'Bánh bao nhân thịt trứng cút nóng hổi', b'0', b'0', b'1', 'Bánh bao nhân thịt', 'cái'),
(18, 350, 'BREAKFAST', '2026-01-27 16:00:12.000000', 'Miến măng gà nước dùng trong veo', b'0', b'0', b'1', 'Miến gà', 'bát'),
(19, 400, 'BREAKFAST', '2026-01-27 16:00:12.000000', 'Bún thang Hà Nội tinh tế, nhiều topping', b'0', b'0', b'1', 'Bún thang', 'bát'),
(20, 320, 'BREAKFAST', '2026-01-27 16:00:12.000000', 'Bánh mì kẹp trứng ốp la lòng đào', b'0', b'0', b'1', 'Bánh mì ốp la', 'cái'),
(21, 250, 'BREAKFAST', '2026-01-27 16:00:12.000000', 'Súp cua đặc sánh, thơm ngon bổ dưỡng', b'0', b'0', b'1', 'Súp cua', 'bát'),
(22, 450, 'BREAKFAST', '2026-01-27 16:00:12.000000', 'Bánh xèo miền Tây giòn rụm nhân tôm thịt', b'0', b'0', b'1', 'Bánh xèo', 'cái'),
(23, 350, 'BREAKFAST', '2026-01-27 16:00:12.000000', 'Bánh khọt cốt dừa béo ngậy nhân tôm', b'0', b'0', b'1', 'Bánh khọt', 'đĩa (5 cái)'),
(24, 450, 'BREAKFAST', '2026-01-27 16:00:12.000000', 'Hủ tiếu Nam Vang đậm đà hương vị miền Nam', b'0', b'0', b'1', 'Hủ tiếu Nam Vang', 'bát'),
(25, 550, 'BREAKFAST', '2026-01-27 16:00:12.000000', 'Bún đậu mắm tôm full topping dồi sụn', b'0', b'0', b'1', 'Bún đậu mắm tôm', 'mẹt'),
(26, 130, 'LUNCH', '2026-01-27 16:00:12.000000', 'Cơm trắng dẻo thơm từ gạo ngon', b'0', b'0', b'1', 'Cơm trắng', 'bát (100g)'),
(27, 250, 'LUNCH', '2026-01-27 16:00:12.000000', 'Cá lóc kho tộ đậm đà đưa cơm', b'0', b'0', b'1', 'Cá kho tộ', 'tô nhỏ'),
(28, 350, 'LUNCH', '2026-01-27 16:00:12.000000', 'Thịt kho trứng vịt nước dừa mềm ngon', b'0', b'0', b'1', 'Thịt kho tàu', 'tô nhỏ'),
(29, 300, 'LUNCH', '2026-01-27 16:00:12.000000', 'Gà rang sả ớt cay nồng kích thích vị giác', b'0', b'0', b'1', 'Gà rang sả ớt', 'đĩa nhỏ'),
(30, 100, 'LUNCH', '2026-01-27 16:00:12.000000', 'Rau muống xào tỏi xanh mướt giòn ngon', b'0', b'0', b'1', 'Rau muống xào tỏi', 'đĩa'),
(31, 200, 'LUNCH', '2026-01-27 16:00:12.000000', 'Đậu phụ chiên sốt cà chua đơn giản mà ngon', b'0', b'0', b'1', 'Đậu phụ sốt cà chua', 'đĩa'),
(32, 150, 'LUNCH', '2026-01-27 16:00:12.000000', 'Canh chua cá lóc giải nhiệt ngày hè', b'0', b'0', b'1', 'Canh chua cá lóc', 'bát tô'),
(33, 350, 'LUNCH', '2026-01-27 16:00:12.000000', 'Sườn non xào chua ngọt đậm đà', b'0', b'0', b'1', 'Sườn xào chua ngọt', 'đĩa'),
(34, 250, 'LUNCH', '2026-01-27 16:00:12.000000', 'Thịt bò xào hoa thiên lý thơm mát', b'0', b'0', b'1', 'Bò xào thiên lý', 'đĩa'),
(35, 200, 'LUNCH', '2026-01-27 16:00:12.000000', 'Mực tươi xào cần tỏi tây giòn ngọt', b'0', b'0', b'1', 'Mực xào cần tỏi', 'đĩa'),
(36, 150, 'LUNCH', '2026-01-27 16:00:12.000000', 'Trứng gà chiên hành tây thơm lừng', b'0', b'0', b'1', 'Trứng chiên', 'cái'),
(37, 300, 'LUNCH', '2026-01-27 16:00:12.000000', 'Cá diêu hồng chiên giòn chấm nước mắm tỏi ớt', b'0', b'0', b'1', 'Cá diêu hồng chiên xù', 'con nhỏ'),
(38, 350, 'LUNCH', '2026-01-27 16:00:12.000000', 'Tôm rang thịt cháy cạnh đậm đà', b'0', b'0', b'1', 'Tôm rang thịt ba chỉ', 'đĩa'),
(39, 80, 'LUNCH', '2026-01-27 16:00:12.000000', 'Canh rau mồng tơi nấu tôm khô ngọt mát', b'0', b'0', b'1', 'Canh mồng tơi nấu tôm', 'bát tô'),
(40, 50, 'LUNCH', '2026-01-27 16:00:12.000000', 'Rau lang luộc chấm nước mắm tỏi', b'0', b'0', b'1', 'Rau lang luộc', 'đĩa'),
(41, 300, 'LUNCH', '2026-01-27 16:00:12.000000', 'Chả thịt cuốn lá lốt chiên thơm nức', b'0', b'0', b'1', 'Chả lá lốt', 'đĩa (5-6 cái)'),
(42, 450, 'LUNCH', '2026-01-27 16:00:12.000000', 'Bò kho ngũ vị hương ăn kèm bánh mì hoặc cơm', b'0', b'0', b'1', 'Bò kho', 'bát'),
(43, 250, 'LUNCH', '2026-01-27 16:00:12.000000', 'Thịt gà ta luộc lá chanh da giòn', b'0', b'0', b'1', 'Gà luộc', 'đĩa nhỏ'),
(44, 400, 'LUNCH', '2026-01-27 16:00:12.000000', 'Nem rán nhân thịt thập cẩm giòn rụm', b'0', b'0', b'1', 'Nem rán (Chả giò)', 'đĩa (4-5 cái)'),
(45, 100, 'LUNCH', '2026-01-27 16:00:12.000000', 'Canh rau ngót thịt nạc bổ dưỡng', b'0', b'0', b'1', 'Canh rau ngót nấu thịt băm', 'bát tô'),
(46, 200, 'LUNCH', '2026-01-27 16:00:12.000000', 'Giá đỗ xào lòng mề gà giòn sần sật', b'0', b'0', b'1', 'Giá đỗ xào lòng gà', 'đĩa'),
(47, 300, 'LUNCH', '2026-01-27 16:00:12.000000', 'Thịt ba chỉ kho măng tươi đậm đà', b'0', b'0', b'1', 'Măng kho thịt', 'đĩa'),
(48, 280, 'LUNCH', '2026-01-27 16:00:12.000000', 'Cá thu chiên sốt cà chua giàu Omega 3', b'0', b'0', b'1', 'Cá thu sốt cà chua', 'lát'),
(49, 150, 'LUNCH', '2026-01-27 16:00:12.000000', 'Mướp đắng xào trứng vị nhẫn đắng tốt cho sức khỏe', b'0', b'0', b'1', 'Khổ qua xào trứng', 'đĩa'),
(50, 600, 'LUNCH', '2026-01-27 16:00:12.000000', 'Cơm rang dưa chua thịt bò đậm vị', b'0', b'0', b'1', 'Cơm rang dưa bò', 'đĩa'),
(51, 200, 'DINNER', '2026-01-27 16:00:12.000000', 'Cơm niêu nấu nồi đất hạt dẻo thơm', b'0', b'0', b'1', 'Cơm niêu', 'niêu nhỏ'),
(52, 180, 'DINNER', '2026-01-27 16:00:12.000000', 'Cá lóc hấp bầu ngọt thanh tự nhiên', b'0', b'0', b'1', 'Cá lóc hấp bầu', 'đĩa'),
(53, 220, 'DINNER', '2026-01-27 16:00:12.000000', 'Tôm đồng rim mặn ngọt đưa cơm', b'0', b'0', b'1', 'Tôm rim mặn ngọt', 'đĩa'),
(54, 40, 'DINNER', '2026-01-27 16:00:12.000000', 'Đậu bắp luộc chấm chao', b'0', b'0', b'1', 'Đậu bắp luộc', 'đĩa'),
(55, 50, 'DINNER', '2026-01-27 16:00:12.000000', 'Canh rong biển nấu đậu hũ non', b'0', b'0', b'1', 'Canh đại dương', 'bát'),
(56, 150, 'DINNER', '2026-01-27 16:00:12.000000', 'Nộm đu đủ tai heo tôm thịt chua ngọt', b'0', b'0', b'1', 'Nộm đu đủ gà xé', 'đĩa'),
(57, 60, 'DINNER', '2026-01-27 16:00:12.000000', 'Gỏi cuốn tôm thịt thanh mát ít calo', b'0', b'0', b'1', 'Gỏi cuốn', 'cái'),
(58, 120, 'DINNER', '2026-01-27 16:00:12.000000', 'Bí đỏ xào tỏi giàu vitamin A', b'0', b'0', b'1', 'Bí đỏ xào tỏi', 'đĩa'),
(59, 250, 'DINNER', '2026-01-27 16:00:12.000000', 'Salad thịt bò trộn dầu giấm chua ngọt', b'0', b'0', b'1', 'Thịt bò trộn dầu giấm', 'đĩa'),
(60, 230, 'DINNER', '2026-01-27 16:00:12.000000', 'Cá hường chiên sả ớt giòn tan', b'0', b'0', b'1', 'Cá hường chiên', 'con'),
(61, 70, 'DINNER', '2026-01-27 16:00:12.000000', 'Canh bí đao nấu tôm nõn thanh nhiệt', b'0', b'0', b'1', 'Canh bí xanh nấu tôm', 'bát tô'),
(62, 90, 'DINNER', '2026-01-27 16:00:12.000000', 'Bắp cải xào cà chua đơn giản', b'0', b'0', b'1', 'Bắp cải xào', 'đĩa'),
(63, 70, 'DINNER', '2026-01-27 16:00:12.000000', 'Trứng gà luộc lòng đào bổ dưỡng', b'0', b'0', b'1', 'Trứng luộc', 'quả'),
(64, 120, 'DINNER', '2026-01-27 16:00:12.000000', 'Đậu phụ luộc thanh đạm chấm mắm tôm', b'0', b'0', b'1', 'Đậu phụ luộc', 'bìa'),
(65, 110, 'DINNER', '2026-01-27 16:00:12.000000', 'Canh cua rau đay mồng tơi mướp hương', b'0', b'0', b'1', 'Canh cua mồng tơi', 'bát tô'),
(66, 280, 'DINNER', '2026-01-27 16:00:12.000000', 'Gà kho gừng ấm bụng ngày mưa', b'0', b'0', b'1', 'Gà kho gừng', 'đĩa'),
(67, 300, 'DINNER', '2026-01-27 16:00:12.000000', 'Thịt ba chỉ luộc chấm mắm tép', b'0', b'0', b'1', 'Ba chỉ luộc', 'đĩa'),
(68, 250, 'DINNER', '2026-01-27 16:00:12.000000', 'Rau củ luộc chấm kho quẹt tôm khô', b'0', b'0', b'1', 'Rau củ quả luộc chấm kho quẹt', 'đĩa'),
(69, 180, 'DINNER', '2026-01-27 16:00:12.000000', 'Cá cơm kho tiêu cay nồng ăn với cháo trắng', b'0', b'0', b'1', 'Cá cơm kho tiêu', 'đĩa nhỏ'),
(70, 200, 'DINNER', '2026-01-27 16:00:12.000000', 'Canh mướp đắng nhồi thịt thanh lọc cơ thể', b'0', b'0', b'1', 'Canh khổ qua nhồi thịt', 'bát'),
(71, 180, 'DINNER', '2026-01-27 16:00:12.000000', 'Mướp hương xào lòng gà thơm ngọt', b'0', b'0', b'1', 'Mướp xào lòng mề', 'đĩa'),
(72, 220, 'DINNER', '2026-01-27 16:00:12.000000', 'Thịt bò xào súp lơ xanh giàu sắt', b'0', b'0', b'1', 'Thịt bò xào bông cải', 'đĩa'),
(73, 250, 'DINNER', '2026-01-27 16:00:12.000000', 'Đậu hũ chiên tẩm sả ớt giòn cay', b'0', b'0', b'1', 'Đậu hũ chiên sả ớt', 'đĩa'),
(74, 130, 'DINNER', '2026-01-27 16:00:12.000000', 'Canh cải bẹ xanh nấu cá rô đồng', b'0', b'0', b'1', 'Canh cải xanh nấu cá', 'bát tô'),
(75, 180, 'DINNER', '2026-01-27 16:00:12.000000', 'Súp ngô ngọt thịt gà xé phay', b'0', b'0', b'1', 'Súp ngô gà', 'bát'),
(76, 250, 'SNACK', '2026-01-27 16:00:12.000000', 'Chè bưởi cốt dừa đậu xanh giòn sật', b'0', b'0', b'1', 'Chè bưởi', 'bát'),
(77, 200, 'SNACK', '2026-01-27 16:00:12.000000', 'Chè đỗ đen đá mát lạnh', b'0', b'0', b'1', 'Chè đỗ đen', 'bát'),
(78, 150, 'SNACK', '2026-01-27 16:00:12.000000', 'Chè dưỡng nhan tuyết yến nhựa đào', b'0', b'0', b'1', 'Chè dưỡng nhan', 'bát'),
(79, 200, 'SNACK', '2026-01-27 16:00:12.000000', 'Sữa chua nếp cẩm tốt cho tiêu hóa', b'0', b'0', b'1', 'Sữa chua nếp cẩm', 'hũ'),
(80, 150, 'SNACK', '2026-01-27 16:00:12.000000', 'Trái cây tô trộn sữa chua', b'0', b'0', b'1', 'Trái cây tô', 'bát'),
(81, 50, 'SNACK', '2026-01-27 16:00:12.000000', 'Cam tươi mọng nước giàu Vitamin C', b'0', b'0', b'1', 'Quả cam', 'quả'),
(82, 60, 'SNACK', '2026-01-27 16:00:12.000000', 'Táo Mỹ giòn ngọt giàu chất xơ', b'0', b'0', b'1', 'Quả táo', 'quả'),
(83, 90, 'SNACK', '2026-01-27 16:00:12.000000', 'Chuối tiêu chín cung cấp kali', b'0', b'0', b'1', 'Quả chuối', 'quả'),
(84, 80, 'SNACK', '2026-01-27 16:00:12.000000', 'Thạch rau câu dừa thanh mát', b'0', b'0', b'1', 'Thạch rau câu', 'đĩa'),
(85, 160, 'SNACK', '2026-01-27 16:00:12.000000', 'Bánh flan trứng sữa caramel mềm mịn', b'0', b'0', b'1', 'Bánh flan', 'cái'),
(86, 120, 'SNACK', '2026-01-27 16:00:12.000000', 'Sữa tươi tiệt trùng không đường', b'0', b'0', b'1', 'Sữa tươi không đường', 'hộp 180ml'),
(87, 160, 'SNACK', '2026-01-27 16:00:12.000000', 'Hạt điều, hạnh nhân, óc chó sấy khô', b'0', b'0', b'1', 'Các loại hạt', 'nắm nhỏ (30g)'),
(88, 120, 'SNACK', '2026-01-27 16:00:12.000000', 'Khoai lang tím luộc giảm cân', b'0', b'0', b'1', 'Khoai lang tím luộc', 'củ vừa'),
(89, 150, 'SNACK', '2026-01-27 16:00:12.000000', 'Ngô nếp luộc dẻo thơm', b'0', b'0', b'1', 'Ngô luộc', 'bắp'),
(90, 300, 'SNACK', '2026-01-27 16:00:12.000000', 'Bữa phụ với bánh giò nóng', b'0', b'0', b'1', 'Bánh giò (phụ)', 'cái'),
(91, 40, 'SNACK', '2026-01-27 16:00:12.000000', 'Nước ép cần tây thanh lọc detox', b'0', b'0', b'1', 'Nước ép cần tây', 'cốc'),
(92, 250, 'SNACK', '2026-01-27 16:00:12.000000', 'Sinh tố bơ cốt dừa béo ngậy', b'0', b'0', b'1', 'Sinh tố bơ', 'cốc'),
(93, 60, 'SNACK', '2026-01-27 16:00:12.000000', 'Nước dừa xiêm tươi mát lành', b'0', b'0', b'1', 'Nước dừa', 'trái'),
(94, 120, 'SNACK', '2026-01-27 16:00:12.000000', 'Bánh bò thốt nốt rễ tre mềm xốp', b'0', b'0', b'1', 'Bánh bò', 'cái'),
(95, 150, 'SNACK', '2026-01-27 16:00:12.000000', 'Bánh da lợn đậu xanh lá dứa dẻo thơm', b'0', b'0', b'1', 'Bánh da lợn', 'miếng'),
(96, 180, 'SNACK', '2026-01-27 16:00:12.000000', 'Trứng vịt lộn hầm ngải cứu', b'0', b'0', b'1', 'Trứng vịt lộn', 'quả'),
(97, 40, 'SNACK', '2026-01-27 16:00:12.000000', 'Nem chua Thanh Hóa tỏi ớt', b'0', b'0', b'1', 'Nem chua', 'cái nhỏ'),
(98, 250, 'SNACK', '2026-01-27 16:00:12.000000', 'Cá viên chiên nước mắm', b'0', b'0', b'1', 'Cá viên chiên', 'xiên (5 cái)'),
(99, 350, 'SNACK', '2026-01-27 16:00:12.000000', 'Bánh tráng trộn bò khô xoài xanh', b'0', b'0', b'1', 'Bánh tráng trộn', 'suất'),
(100, 350, 'SNACK', '2026-01-27 16:00:12.000000', 'Trà sữa trân châu đường đen (hạn chế uống)', b'0', b'0', b'1', 'Trà sữa', 'cốc'),
(101, 450, 'LUNCH', '2026-01-28 15:54:34.000000', 'AI nhận diện món từ văn bản/giọng nói người dùng.', b'1', b'0', b'1', 'Cơm gà', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `health_analysis`
--

CREATE TABLE `health_analysis` (
  `id` bigint(20) NOT NULL,
  `analysis_json` longtext NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `health_analysis`
--

INSERT INTO `health_analysis` (`id`, `analysis_json`, `created_at`, `updated_at`, `user_id`) VALUES
(1, '{\"analysis\": \"{\\\"bmi\\\": 27.7, \\\"bmr\\\": 1850, \\\"tdee\\\": 2200, \\\"status\\\": \\\"OVERWEIGHT\\\", \\\"advice\\\": \\\"Bạn đang thừa cân (BMI > 25). Hãy hạn chế tinh bột, đồ ngọt và tập Cardio cường độ cao 30 phút/ngày.\\\"}\"}', '2026-01-27 16:00:13.000000', '2026-01-27 16:00:13.000000', 2),
(2, '{\"analysis\": \"{\\\"bmi\\\": 18.3, \\\"bmr\\\": 1200, \\\"tdee\\\": 1500, \\\"status\\\": \\\"UNDERWEIGHT\\\", \\\"advice\\\": \\\"Chỉ số BMI thấp. Bạn cần bổ sung thêm Protein, chất béo lành mạnh và chia nhỏ thành 5 bữa ăn mỗi ngày.\\\"}\"}', '2026-01-27 16:00:13.000000', '2026-01-27 16:00:13.000000', 3),
(3, '{\"analysis\": \"{\\\"bmi\\\": 22.9, \\\"bmr\\\": 1600, \\\"tdee\\\": 2100, \\\"status\\\": \\\"NORMAL\\\", \\\"advice\\\": \\\"Chỉ số cơ thể rất cân đối. Hãy duy trì chế độ ăn uống hiện tại và uống đủ 2 lít nước mỗi ngày.\\\"}\"}', '2026-01-27 16:00:13.000000', '2026-01-27 16:00:13.000000', 4),
(4, '{\"analysis\": \"{\\\"bmi\\\": 32.6, \\\"bmr\\\": 2100, \\\"tdee\\\": 2400, \\\"status\\\": \\\"OBESE\\\", \\\"advice\\\": \\\"Cảnh báo mức độ Béo phì I. Cần cắt giảm tối đa đường, mỡ động vật và tham khảo ý kiến bác sĩ dinh dưỡng ngay.\\\"}\"}', '2026-01-27 16:00:13.000000', '2026-01-27 16:00:13.000000', 5),
(5, '{\"analysis\": \"{\\\"bmi\\\": 22.8, \\\"bmr\\\": 1350, \\\"tdee\\\": 1700, \\\"status\\\": \\\"NORMAL\\\", \\\"advice\\\": \\\"Sức khỏe tốt. Bạn nên tập Yoga hoặc chạy bộ nhẹ nhàng để cơ thể dẻo dai hơn.\\\"}\"}', '2026-01-27 16:00:13.000000', '2026-01-27 16:00:13.000000', 6),
(6, '{\"analysis\": \"{\\\"bmi\\\": 23.1, \\\"bmr\\\": 1750, \\\"tdee\\\": 2600, \\\"status\\\": \\\"NORMAL\\\", \\\"advice\\\": \\\"Thể trạng rất tốt, khung xương lớn. Phù hợp với các bài tập Hypertrophy để phát triển cơ bắp tối đa.\\\"}\"}', '2026-01-27 16:00:13.000000', '2026-01-27 16:00:13.000000', 7),
(7, '{\"analysis\": \"{\\\"bmi\\\": 22.0, \\\"bmr\\\": 1400, \\\"tdee\\\": 1800, \\\"status\\\": \\\"NORMAL\\\", \\\"advice\\\": \\\"Chỉ số BMI chuẩn. Nên tăng cường ăn rau xanh, trái cây và hạn chế thức ăn nhanh.\\\"}\"}', '2026-01-27 16:00:13.000000', '2026-01-27 16:00:13.000000', 8),
(8, '{\"analysis\": \"{\\\"bmi\\\": 17.3, \\\"bmr\\\": 1300, \\\"tdee\\\": 1600, \\\"status\\\": \\\"UNDERWEIGHT\\\", \\\"advice\\\": \\\"Bạn quá gầy. Cần ngủ đủ 8 tiếng/ngày và uống thêm các loại sữa giàu năng lượng (Mass Gainer).\\\"}\"}', '2026-01-27 16:00:13.000000', '2026-01-27 16:00:13.000000', 9),
(9, '{\"analysis\": \"{\\\"bmi\\\": 26.0, \\\"bmr\\\": 1450, \\\"tdee\\\": 1900, \\\"status\\\": \\\"OVERWEIGHT\\\", \\\"advice\\\": \\\"Hơi thừa cân một chút. Chỉ cần đi bộ nhanh 15 phút mỗi ngày và giảm ăn vặt buổi tối là ổn.\\\"}\"}', '2026-01-27 16:00:13.000000', '2026-01-27 16:00:13.000000', 10),
(10, '{\"analysis\": \"{\\\"bmi\\\": 25.2, \\\"bmr\\\": 1800, \\\"tdee\\\": 2100, \\\"status\\\": \\\"OVERWEIGHT\\\", \\\"advice\\\": \\\"Chớm thừa cân. Bạn cần vận động nhiều hơn thay vì ngồi một chỗ quá lâu tại văn phòng.\\\"}\"}', '2026-01-27 16:00:14.000000', '2026-01-27 16:00:14.000000', 11),
(11, '{\"analysis\": \"{\\\"bmi\\\": 18.7, \\\"bmr\\\": 1250, \\\"tdee\\\": 1550, \\\"status\\\": \\\"NORMAL\\\", \\\"advice\\\": \\\"Dáng người mảnh mai nhưng vẫn trong mức bình thường. Cố gắng đừng để sụt cân thêm nhé.\\\"}\"}', '2026-01-27 16:00:14.000000', '2026-01-27 16:00:14.000000', 12),
(12, '{\"analysis\": \"{\\\"bmi\\\": 23.8, \\\"bmr\\\": 1550, \\\"tdee\\\": 2000, \\\"status\\\": \\\"NORMAL\\\", \\\"advice\\\": \\\"Sức khỏe tốt, các chỉ số ổn định. Hãy duy trì thói quen khám sức khỏe định kỳ 6 tháng/lần.\\\"}\"}', '2026-01-27 16:00:14.000000', '2026-01-27 16:00:14.000000', 13),
(13, '{\"analysis\": \"{\\\"bmi\\\": 20.0, \\\"bmr\\\": 1380, \\\"tdee\\\": 1900, \\\"status\\\": \\\"NORMAL\\\", \\\"advice\\\": \\\"Dáng người rất chuẩn và năng động. Phù hợp với các môn thể thao như Bơi lội, Tennis hoặc Yoga.\\\"}\"}', '2026-01-27 16:00:14.000000', '2026-01-27 16:00:14.000000', 14),
(14, '{\"analysis\": \"{\\\"bmi\\\": 29.0, \\\"bmr\\\": 1950, \\\"tdee\\\": 2300, \\\"status\\\": \\\"OVERWEIGHT\\\", \\\"advice\\\": \\\"Sắp chạm ngưỡng béo phì. Cần nghiêm túc thực hiện chế độ ăn kiêng Low-carb (giảm tinh bột) ngay.\\\"}\"}', '2026-01-27 16:00:14.000000', '2026-01-27 16:00:14.000000', 15),
(15, '{\"analysis\": \"{\\\"bmi\\\": 17.7, \\\"bmr\\\": 1150, \\\"tdee\\\": 1400, \\\"status\\\": \\\"UNDERWEIGHT\\\", \\\"advice\\\": \\\"Cơ thể thiếu cân và dưỡng chất. Cần chú trọng bổ sung Vitamin tổng hợp và khoáng chất.\\\"}\"}', '2026-01-27 16:00:14.000000', '2026-01-27 16:00:14.000000', 16),
(16, '{\"analysis\": \"{\\\"bmi\\\": 24.7, \\\"bmr\\\": 1900, \\\"tdee\\\": 2500, \\\"status\\\": \\\"NORMAL\\\", \\\"advice\\\": \\\"Chỉ số BMI đang ở mức giới hạn trên của bình thường. Hãy cẩn thận trong ăn uống kẻo bị tăng cân.\\\"}\"}', '2026-01-27 16:00:14.000000', '2026-01-27 16:00:14.000000', 17),
(17, '{\"analysis\": \"{\\\"bmi\\\": 25.2, \\\"bmr\\\": 1650, \\\"tdee\\\": 2000, \\\"status\\\": \\\"OVERWEIGHT\\\", \\\"advice\\\": \\\"Bạn nên giảm bớt khẩu phần ăn vặt, trà sữa và các món nhiều dầu mỡ (chiên, xào).\\\"}\"}', '2026-01-27 16:00:14.000000', '2026-01-27 16:00:14.000000', 18),
(18, '{\"analysis\": \"{\\\"bmi\\\": 20.3, \\\"bmr\\\": 1300, \\\"tdee\\\": 1750, \\\"status\\\": \\\"NORMAL\\\", \\\"advice\\\": \\\"Cơ thể cân đối, khỏe mạnh. Hãy giữ tinh thần thoải mái, tránh stress để duy trì vóc dáng.\\\"}\"}', '2026-01-27 16:00:14.000000', '2026-01-27 16:00:14.000000', 19),
(19, '{\"analysis\": \"{\\\"bmi\\\": 25.1, \\\"bmr\\\": 1700, \\\"tdee\\\": 2050, \\\"status\\\": \\\"OVERWEIGHT\\\", \\\"advice\\\": \\\"Cần hạn chế bia rượu và vận động nhiều hơn để giảm mỡ vùng bụng.\\\"}\"}', '2026-01-27 16:00:15.000000', '2026-01-27 16:00:15.000000', 20),
(20, '{\"analysis\": \"{\\\"bmi\\\": 20.8, \\\"bmr\\\": 1100, \\\"tdee\\\": 1300, \\\"status\\\": \\\"NORMAL\\\", \\\"advice\\\": \\\"Chỉ số rất tốt ở độ tuổi này. Nên tập dưỡng sinh nhẹ nhàng và ăn thực phẩm dễ tiêu hóa.\\\"}\"}', '2026-01-27 16:00:15.000000', '2026-01-27 16:00:15.000000', 21),
(21, '{\"analysis\":{\"bmi\":18.52,\"bmr\":1992.0,\"tdee\":2390.4,\"healthStatus\":\"UNDERWEIGHT\",\"summary\":\"Người dùng có chỉ số BMI dưới mức bình thường, cần tăng cân và cải thiện chế độ ăn uống.\"},\"lifestyleInsights\":{\"activity\":\"Ít vận động\",\"sleep\":\"Ngủ 7-9 tiếng\",\"stress\":\"Rất cao\"},\"threeMonthPlan\":{\"goal\":\"MUSCLE_GAIN\",\"totalTargetWeightChangeKg\":5.0,\"months\":[{\"month\":1,\"title\":\"Tăng cường dinh dưỡng\",\"dailyCalories\":2500,\"macronutrients\":\"Đạm: 120g (20%)- Béo: 70g (25%)- Tinh bột: 300g (55%)\",\"habitFocus\":\"Ăn uống cân đối\",\"mealTips\":\"Ăn nhiều protein, hạn chế đường và chất béo bão hòa\",\"specificActions\":\"Uống 2L nước lọc mỗi ngày. Ăn 5 bữa một ngày. Ngủ đủ 8 tiếng.\",\"sampleDailyMeals\":[{\"mealName\":\"Phở gà lườn (không da)\",\"quantity\":\"1 bát tô vừa (150g bánh phở)\",\"calories\":420,\"type\":\"Sáng\"},{\"mealName\":\"Cơm tấm bì chả (hạn chế mỡ hành)\",\"quantity\":\"1 đĩa (1 bát cơm trắng)\",\"calories\":550,\"type\":\"Trưa\"},{\"mealName\":\"Cá hồi nướng (150g)\",\"quantity\":\"1 miếng (150g)\",\"calories\":210,\"type\":\"Tối\"},{\"mealName\":\"Sữa tươi không đường (1 ly)\",\"quantity\":\"1 ly (200ml)\",\"calories\":80,\"type\":\"Phụ\"}],\"weeks\":[{\"week\":1,\"title\":\"Tăng cường protein\",\"nutritionFocus\":\"Nạp nhiều đạm\",\"mealTips\":\"Ăn nhiều thịt, cá, trứng\",\"note\":\"Hạn chế đồ uống có gas\"},{\"week\":2,\"title\":\"Tăng cường tinh bột\",\"nutritionFocus\":\"Nạp nhiều tinh bột\",\"mealTips\":\"Ăn nhiều gạo, bánh mì, trái cây\",\"note\":\"Uống nhiều nước\"},{\"week\":3,\"title\":\"Tăng cường vitamin và khoáng chất\",\"nutritionFocus\":\"Nạp nhiều vitamin và khoáng chất\",\"mealTips\":\"Ăn nhiều rau xanh, hoa quả\",\"note\":\"Hạn chế thực phẩm chế biến sẵn\"},{\"week\":4,\"title\":\"Kết hợp và cân đối\",\"nutritionFocus\":\"Kết hợp và cân đối dinh dưỡng\",\"mealTips\":\"Ăn uống cân đối, đa dạng\",\"note\":\"Đánh giá và điều chỉnh kế hoạch\"}],\"note\":\"Cần tuân thủ và điều chỉnh kế hoạch thường xuyên.\"},{\"month\":2,\"title\":\"Tăng cường vận động\",\"dailyCalories\":2600,\"macronutrients\":\"Đạm: 130g (20%)- Béo: 75g (25%)- Tinh bột: 320g (55%)\",\"habitFocus\":\"Vận động thường xuyên\",\"mealTips\":\"Ăn uống cân đối, tăng cường vận động\",\"specificActions\":\"Uống 2L nước lọc mỗi ngày. Vận động 30 phút mỗi ngày. Ngủ đủ 8 tiếng.\",\"sampleDailyMeals\":[{\"mealName\":\"Phở gà lườn (không da)\",\"quantity\":\"1 bát tô vừa (150g bánh phở)\",\"calories\":420,\"type\":\"Sáng\"},{\"mealName\":\"Cơm tấm bì chả (hạn chế mỡ hành)\",\"quantity\":\"1 đĩa (1 bát cơm trắng)\",\"calories\":550,\"type\":\"Trưa\"},{\"mealName\":\"Cá hồi nướng (150g)\",\"quantity\":\"1 miếng (150g)\",\"calories\":210,\"type\":\"Tối\"},{\"mealName\":\"Sữa tươi không đường (1 ly)\",\"quantity\":\"1 ly (200ml)\",\"calories\":80,\"type\":\"Phụ\"}],\"weeks\":[{\"week\":1,\"title\":\"Tăng cường vận động nhẹ\",\"nutritionFocus\":\"Nạp nhiều đạm\",\"mealTips\":\"Ăn nhiều thịt, cá, trứng\",\"note\":\"Hạn chế đồ uống có gas\"},{\"week\":2,\"title\":\"Tăng cường vận động vừa\",\"nutritionFocus\":\"Nạp nhiều tinh bột\",\"mealTips\":\"Ăn nhiều gạo, bánh mì, trái cây\",\"note\":\"Uống nhiều nước\"},{\"week\":3,\"title\":\"Tăng cường vận động mạnh\",\"nutritionFocus\":\"Nạp nhiều vitamin và khoáng chất\",\"mealTips\":\"Ăn nhiều rau xanh, hoa quả\",\"note\":\"Hạn chế thực phẩm chế biến sẵn\"},{\"week\":4,\"title\":\"Kết hợp và cân đối\",\"nutritionFocus\":\"Kết hợp và cân đối dinh dưỡng\",\"mealTips\":\"Ăn uống cân đối, đa dạng\",\"note\":\"Đánh giá và điều chỉnh kế hoạch\"}],\"note\":\"Cần tuân thủ và điều chỉnh kế hoạch thường xuyên.\"},{\"month\":3,\"title\":\"Duy trì và hoàn thiện\",\"dailyCalories\":2500,\"macronutrients\":\"Đạm: 120g (20%)- Béo: 70g (25%)- Tinh bột: 300g (55%)\",\"habitFocus\":\"Duy trì thói quen lành mạnh\",\"mealTips\":\"Ăn uống cân đối, hạn chế đường và chất béo bão hòa\",\"specificActions\":\"Uống 2L nước lọc mỗi ngày. Vận động 30 phút mỗi ngày. Ngủ đủ 8 tiếng.\",\"sampleDailyMeals\":[{\"mealName\":\"Phở gà lườn (không da)\",\"quantity\":\"1 bát tô vừa (150g bánh phở)\",\"calories\":420,\"type\":\"Sáng\"},{\"mealName\":\"Cơm tấm bì chả (hạn chế mỡ hành)\",\"quantity\":\"1 đĩa (1 bát cơm trắng)\",\"calories\":550,\"type\":\"Trưa\"},{\"mealName\":\"Cá hồi nướng (150g)\",\"quantity\":\"1 miếng (150g)\",\"calories\":210,\"type\":\"Tối\"},{\"mealName\":\"Sữa tươi không đường (1 ly)\",\"quantity\":\"1 ly (200ml)\",\"calories\":80,\"type\":\"Phụ\"}],\"weeks\":[{\"week\":1,\"title\":\"Duy trì dinh dưỡng\",\"nutritionFocus\":\"Nạp nhiều đạm\",\"mealTips\":\"Ăn nhiều thịt, cá, trứng\",\"note\":\"Hạn chế đồ uống có gas\"},{\"week\":2,\"title\":\"Duy trì vận động\",\"nutritionFocus\":\"Nạp nhiều tinh bột\",\"mealTips\":\"Ăn nhiều gạo, bánh mì, trái cây\",\"note\":\"Uống nhiều nước\"},{\"week\":3,\"title\":\"Hoàn thiện thói quen\",\"nutritionFocus\":\"Nạp nhiều vitamin và khoáng chất\",\"mealTips\":\"Ăn nhiều rau xanh, hoa quả\",\"note\":\"Hạn chế thực phẩm chế biến sẵn\"},{\"week\":4,\"title\":\"Kết hợp và cân đối\",\"nutritionFocus\":\"Kết hợp và cân đối dinh dưỡng\",\"mealTips\":\"Ăn uống cân đối, đa dạng\",\"note\":\"Đánh giá và điều chỉnh kế hoạch\"}],\"note\":\"Cần tuân thủ và điều chỉnh kế hoạch thường xuyên.\"}]}}', '2026-01-28 12:31:37.000000', '2026-01-28 12:31:37.000000', 22),
(22, '{\"analysis\":{\"bmi\":18.52,\"bmr\":1992.0,\"tdee\":2390.4,\"healthStatus\":\"UNDERWEIGHT\",\"summary\":\"Người dùng có chỉ số BMI dưới mức bình thường, cần tăng cân và cải thiện chế độ dinh dưỡng.\"},\"lifestyleInsights\":{\"activity\":\"Ít vận động\",\"sleep\":\"Ngủ 7-9 tiếng\",\"stress\":\"Rất cao\"},\"threeMonthPlan\":{\"goal\":\"WEIGHT_LOSS\",\"totalTargetWeightChangeKg\":5.0,\"months\":[{\"month\":1,\"title\":\"Tăng cường dinh dưỡng\",\"dailyCalories\":2500,\"macronutrients\":\"Đạm: 120g (20%)- Béo: 70g (25%)- Tinh bột: 300g (55%)\",\"habitFocus\":\"Ăn uống cân đối\",\"mealTips\":\"Ăn nhiều trái cây, rau xanh, và thực phẩm giàu protein\",\"specificActions\":\"Uống 2L nước lọc mỗi ngày, đi bộ nhanh 30p sau mỗi bữa ăn chính, ngủ đủ 8 tiếng\",\"sampleDailyMeals\":[{\"mealName\":\"Phở gà lườn (không da)\",\"quantity\":\"1 bát tô vừa (150g bánh phở)\",\"calories\":420,\"type\":\"Sáng\"},{\"mealName\":\"Cơm tấm bì chả (hạn chế mỡ hành)\",\"quantity\":\"1 đĩa (1 bát cơm trắng)\",\"calories\":550,\"type\":\"Trưa\"},{\"mealName\":\"Cá chép kho tộ\",\"quantity\":\"1 con cá chép (150g)\",\"calories\":180,\"type\":\"Tối\"},{\"mealName\":\"Sữa chua không đường\",\"quantity\":\"1 hộp\",\"calories\":80,\"type\":\"Phụ\"}],\"weeks\":[{\"week\":1,\"title\":\"Tăng cường protein\",\"nutritionFocus\":\"Nạp nhiều protein, giảm tinh bột nhanh\",\"mealTips\":\"Ăn nhiều thịt, cá, trứng\",\"note\":\"Hạn chế đồ uống có gas\"},{\"week\":2,\"title\":\"Tăng cường chất xơ\",\"nutritionFocus\":\"Nạp nhiều chất xơ, giảm béo\",\"mealTips\":\"Ăn nhiều rau xanh, trái cây\",\"note\":\"Uống nhiều nước\"},{\"week\":3,\"title\":\"Tăng cường vitamin\",\"nutritionFocus\":\"Nạp nhiều vitamin, giảm đường\",\"mealTips\":\"Ăn nhiều trái cây, rau xanh\",\"note\":\"Hạn chế đồ ăn nhanh\"},{\"week\":4,\"title\":\"Cân đối dinh dưỡng\",\"nutritionFocus\":\"Cân đối dinh dưỡng, giảm stress\",\"mealTips\":\"Ăn uống cân đối, giảm stress\",\"note\":\"Tập trung vào giấc ngủ\"}],\"note\":\"Cần tuân thủ chế độ dinh dưỡng và lối sống lành mạnh\"},{\"month\":2,\"title\":\"Tăng cường vận động\",\"dailyCalories\":2600,\"macronutrients\":\"Đạm: 130g (20%)- Béo: 75g (25%)- Tinh bột: 320g (55%)\",\"habitFocus\":\"Vận động thường xuyên\",\"mealTips\":\"Ăn nhiều thực phẩm giàu protein, chất xơ\",\"specificActions\":\"Uống 2L nước lọc mỗi ngày, đi bộ nhanh 45p sau mỗi bữa ăn chính, ngủ đủ 8 tiếng\",\"sampleDailyMeals\":[{\"mealName\":\"Bánh mì thịt gà\",\"quantity\":\"1 bánh mì\",\"calories\":500,\"type\":\"Sáng\"},{\"mealName\":\"Cơm gà xào rau\",\"quantity\":\"1 đĩa (1 bát cơm trắng)\",\"calories\":600,\"type\":\"Trưa\"},{\"mealName\":\"Cá hồi nướng\",\"quantity\":\"1 con cá hồi (150g)\",\"calories\":200,\"type\":\"Tối\"},{\"mealName\":\"Sữa chua không đường\",\"quantity\":\"1 hộp\",\"calories\":80,\"type\":\"Phụ\"}],\"weeks\":[{\"week\":1,\"title\":\"Tăng cường vận động\",\"nutritionFocus\":\"Nạp nhiều protein, giảm tinh bột nhanh\",\"mealTips\":\"Ăn nhiều thịt, cá, trứng\",\"note\":\"Hạn chế đồ uống có gas\"},{\"week\":2,\"title\":\"Tăng cường chất xơ\",\"nutritionFocus\":\"Nạp nhiều chất xơ, giảm béo\",\"mealTips\":\"Ăn nhiều rau xanh, trái cây\",\"note\":\"Uống nhiều nước\"},{\"week\":3,\"title\":\"Tăng cường vitamin\",\"nutritionFocus\":\"Nạp nhiều vitamin, giảm đường\",\"mealTips\":\"Ăn nhiều trái cây, rau xanh\",\"note\":\"Hạn chế đồ ăn nhanh\"},{\"week\":4,\"title\":\"Cân đối dinh dưỡng\",\"nutritionFocus\":\"Cân đối dinh dưỡng, giảm stress\",\"mealTips\":\"Ăn uống cân đối, giảm stress\",\"note\":\"Tập trung vào giấc ngủ\"}],\"note\":\"Cần tuân thủ chế độ dinh dưỡng và lối sống lành mạnh\"},{\"month\":3,\"title\":\"Cân đối và duy trì\",\"dailyCalories\":2500,\"macronutrients\":\"Đạm: 120g (20%)- Béo: 70g (25%)- Tinh bột: 300g (55%)\",\"habitFocus\":\"Duy trì lối sống lành mạnh\",\"mealTips\":\"Ăn nhiều trái cây, rau xanh, và thực phẩm giàu protein\",\"specificActions\":\"Uống 2L nước lọc mỗi ngày, đi bộ nhanh 30p sau mỗi bữa ăn chính, ngủ đủ 8 tiếng\",\"sampleDailyMeals\":[{\"mealName\":\"Phở gà lườn (không da)\",\"quantity\":\"1 bát tô vừa (150g bánh phở)\",\"calories\":420,\"type\":\"Sáng\"},{\"mealName\":\"Cơm tấm bì chả (hạn chế mỡ hành)\",\"quantity\":\"1 đĩa (1 bát cơm trắng)\",\"calories\":550,\"type\":\"Trưa\"},{\"mealName\":\"Cá chép kho tộ\",\"quantity\":\"1 con cá chép (150g)\",\"calories\":180,\"type\":\"Tối\"},{\"mealName\":\"Sữa chua không đường\",\"quantity\":\"1 hộp\",\"calories\":80,\"type\":\"Phụ\"}],\"weeks\":[{\"week\":1,\"title\":\"Duy trì dinh dưỡng\",\"nutritionFocus\":\"Cân đối dinh dưỡng\",\"mealTips\":\"Ăn uống cân đối\",\"note\":\"Tập trung vào giấc ngủ\"},{\"week\":2,\"title\":\"Tăng cường vận động\",\"nutritionFocus\":\"Nạp nhiều protein, giảm tinh bột nhanh\",\"mealTips\":\"Ăn nhiều thịt, cá, trứng\",\"note\":\"Hạn chế đồ uống có gas\"},{\"week\":3,\"title\":\"Tăng cường chất xơ\",\"nutritionFocus\":\"Nạp nhiều chất xơ, giảm béo\",\"mealTips\":\"Ăn nhiều rau xanh, trái cây\",\"note\":\"Uống nhiều nước\"},{\"week\":4,\"title\":\"Kết thúc và đánh giá\",\"nutritionFocus\":\"Cân đối dinh dưỡng, giảm stress\",\"mealTips\":\"Ăn uống cân đối, giảm stress\",\"note\":\"Tập trung vào giấc ngủ\"}],\"note\":\"Cần tuân thủ chế độ dinh dưỡng và lối sống lành mạnh\"}]}}', '2026-01-28 12:43:39.000000', '2026-01-28 12:43:39.000000', 24),
(23, '{\"analysis\":{\"bmi\":34.6,\"bmr\":1.987,\"tdee\":2.385,\"healthStatus\":\"OBESE\",\"summary\":\"Người dùng có chỉ số BMI 34.6, thuộc nhóm béo phì. Cần giảm cân để cải thiện sức khỏe.\"},\"lifestyleInsights\":{\"activity\":\"Ít vận động\",\"sleep\":\"Ngủ 7-9 tiếng mỗi ngày\",\"stress\":\"Mức độ stress thấp\"},\"threeMonthPlan\":{\"goal\":\"WEIGHT_LOSS\",\"totalTargetWeightChangeKg\":10.0,\"months\":[{\"month\":1,\"title\":\"Giảm cân ban đầu\",\"dailyCalories\":1800,\"macronutrients\":\"Đạm: 120g (25%)- Béo: 40g (20%)- Tinh bột: 200g (55%)\",\"habitFocus\":\"Ăn uống lành mạnh\",\"mealTips\":\"Ăn nhiều rau xanh, hoa quả, hạn chế đồ ăn nhanh\",\"specificActions\":\"Uống 2L nước lọc mỗi ngày. Đi bộ nhanh 30p sau mỗi bữa ăn chính.\",\"sampleDailyMeals\":[{\"mealName\":\"Cháo gà\",\"quantity\":\"1 bát tô vừa\",\"calories\":300,\"type\":\"Sáng\"},{\"mealName\":\"Cơm trắng với cá chiên và rau xanh\",\"quantity\":\"1 đĩa\",\"calories\":500,\"type\":\"Trưa\"},{\"mealName\":\"Súp lơ xanh luộc và thịt gà nướng\",\"quantity\":\"1 đĩa\",\"calories\":400,\"type\":\"Tối\"},{\"mealName\":\"Sữa chua không đường\",\"quantity\":\"1 hộp\",\"calories\":100,\"type\":\"Phụ\"}],\"weeks\":[{\"week\":1,\"title\":\"Bắt đầu giảm cân\",\"nutritionFocus\":\"Giảm tinh bột nhanh\",\"mealTips\":\"Hạn chế đồ ăn có đường\",\"note\":\"Ăn uống cân đối\"},{\"week\":2,\"title\":\"Tăng cường vận động\",\"nutritionFocus\":\"Tăng chất xơ\",\"mealTips\":\"Ăn nhiều hoa quả\",\"note\":\"Hạn chế đồ uống có gas\"},{\"week\":3,\"title\":\"Cải thiện thói quen\",\"nutritionFocus\":\"Giảm chất béo\",\"mealTips\":\"Hạn chế đồ chiên rán\",\"note\":\"Uống đủ nước\"},{\"week\":4,\"title\":\"Đánh giá tiến độ\",\"nutritionFocus\":\"Cân đối dinh dưỡng\",\"mealTips\":\"Ăn uống linh hoạt\",\"note\":\"Điều chỉnh kế hoạch nếu cần\"}],\"note\":\"Cần kiên trì và có kế hoạch cụ thể\"},{\"month\":2,\"title\":\"Tăng cường giảm cân\",\"dailyCalories\":1700,\"macronutrients\":\"Đạm: 110g (25%)- Béo: 35g (20%)- Tinh bột: 180g (55%)\",\"habitFocus\":\"Tăng cường vận động\",\"mealTips\":\"Ăn nhiều protein, hạn chế tinh bột\",\"specificActions\":\"Uống 2.5L nước lọc mỗi ngày. Đi bộ nhanh 45p sau mỗi bữa ăn chính.\",\"sampleDailyMeals\":[{\"mealName\":\"Trứng ốp la với rau xanh\",\"quantity\":\"2 quả trứng\",\"calories\":200,\"type\":\"Sáng\"},{\"mealName\":\"Cơm gạo lứt với cá chiên và rau muống\",\"quantity\":\"1 đĩa\",\"calories\":450,\"type\":\"Trưa\"},{\"mealName\":\"Thịt gà nướng với khoai tây luộc\",\"quantity\":\"1 đĩa\",\"calories\":350,\"type\":\"Tối\"},{\"mealName\":\"Sữa tươi không đường\",\"quantity\":\"1 cốc\",\"calories\":80,\"type\":\"Phụ\"}],\"weeks\":[{\"week\":1,\"title\":\"Tăng cường protein\",\"nutritionFocus\":\"Tăng cường chất xơ\",\"mealTips\":\"Ăn nhiều rau xanh\",\"note\":\"Hạn chế đồ ăn nhanh\"},{\"week\":2,\"title\":\"Cải thiện vận động\",\"nutritionFocus\":\"Tăng cường đốt cháy calo\",\"mealTips\":\"Hạn chế đồ uống có đường\",\"note\":\"Uống đủ nước\"},{\"week\":3,\"title\":\"Đánh giá tiến độ\",\"nutritionFocus\":\"Cân đối dinh dưỡng\",\"mealTips\":\"Ăn uống linh hoạt\",\"note\":\"Điều chỉnh kế hoạch nếu cần\"},{\"week\":4,\"title\":\"Chuẩn bị cho tháng cuối\",\"nutritionFocus\":\"Củng cố thói quen\",\"mealTips\":\"Ăn uống lành mạnh\",\"note\":\"Cần kiên trì\"}],\"note\":\"Cần duy trì và có kế hoạch cụ thể\"},{\"month\":3,\"title\":\"Duy trì và hoàn thiện\",\"dailyCalories\":1600,\"macronutrients\":\"Đạm: 100g (25%)- Béo: 30g (20%)- Tinh bột: 160g (55%)\",\"habitFocus\":\"Duy trì thói quen lành mạnh\",\"mealTips\":\"Ăn nhiều rau xanh, hoa quả, hạn chế đồ ăn nhanh\",\"specificActions\":\"Uống 2L nước lọc mỗi ngày. Đi bộ nhanh 30p sau mỗi bữa ăn chính.\",\"sampleDailyMeals\":[{\"mealName\":\"Cháo yến mạch với trái cây\",\"quantity\":\"1 bát tô vừa\",\"calories\":250,\"type\":\"Sáng\"},{\"mealName\":\"Cơm trắng với cá chiên và rau xanh\",\"quantity\":\"1 đĩa\",\"calories\":400,\"type\":\"Trưa\"},{\"mealName\":\"Thịt gà nướng với rau muống\",\"quantity\":\"1 đĩa\",\"calories\":300,\"type\":\"Tối\"},{\"mealName\":\"Sữa chua không đường\",\"quantity\":\"1 hộp\",\"calories\":100,\"type\":\"Phụ\"}],\"weeks\":[{\"week\":1,\"title\":\"Duy trì giảm cân\",\"nutritionFocus\":\"Cân đối dinh dưỡng\",\"mealTips\":\"Ăn uống linh hoạt\",\"note\":\"Cần kiên trì\"},{\"week\":2,\"title\":\"Tăng cường vận động\",\"nutritionFocus\":\"Tăng cường đốt cháy calo\",\"mealTips\":\"Hạn chế đồ uống có đường\",\"note\":\"Uống đủ nước\"},{\"week\":3,\"title\":\"Đánh giá tiến độ\",\"nutritionFocus\":\"Cân đối dinh dưỡng\",\"mealTips\":\"Ăn uống linh hoạt\",\"note\":\"Điều chỉnh kế hoạch nếu cần\"},{\"week\":4,\"title\":\"Hoàn thiện kế hoạch\",\"nutritionFocus\":\"Củng cố thói quen\",\"mealTips\":\"Ăn uống lành mạnh\",\"note\":\"Cần duy trì\"}],\"note\":\"Cần duy trì và có kế hoạch cụ thể\"}]}}', '2026-01-28 16:20:52.000000', '2026-01-28 16:20:52.000000', 25),
(24, '{\"analysis\":{\"bmi\":23.5,\"bmr\":1.987,\"tdee\":2.387,\"healthStatus\":\"NORMAL\",\"summary\":\"Người dùng có chỉ số BMI trong phạm vi bình thường, nhưng mức độ vận động thấp có thể dẫn đến tích tụ mỡ thừa nếu không kiểm soát chế độ ăn uống.\"},\"lifestyleInsights\":{\"activity\":\"Ít vận động, nên tăng cường hoạt động thể chất hàng ngày.\",\"sleep\":\"Ngủ đủ 7-9 tiếng mỗi ngày, giúp cơ thể phục hồi và tái tạo năng lượng.\",\"stress\":\"Mức độ stress thấp, cần duy trì lối sống cân bằng để tránh tăng stress.\"},\"threeMonthPlan\":{\"goal\":\"MAINTENANCE\",\"totalTargetWeightChangeKg\":0.0,\"months\":[{\"month\":1,\"title\":\"Cân bằng dinh dưỡng\",\"dailyCalories\":2200,\"macronutrients\":\"Đạm: 120g (20%)- Béo: 70g (30%)- Tinh bột: 250g (50%)\",\"habitFocus\":\"Tăng cường ăn rau xanh, trái cây và hạn chế đồ uống có đường.\",\"mealTips\":\"Ăn nhiều bữa nhỏ, tránh ăn quá no một lúc. Uống 적 nhất 2L nước mỗi ngày.\",\"specificActions\":\"- Uống 2L nước lọc mỗi ngày. - Đi bộ nhanh 10p sau mỗi bữa ăn chính. - Ngủ đủ 8 tiếng, bắt đầu từ 22h.\",\"sampleDailyMeals\":[{\"mealName\":\"Phở gà lườn (không da)\",\"quantity\":\"1 bát tô vừa (150g bánh phở)\",\"calories\":420,\"type\":\"Sáng\"},{\"mealName\":\"Cơm tấm bì chả (hạn chế mỡ hành)\",\"quantity\":\"1 đĩa (1 bát cơm trắng)\",\"calories\":550,\"type\":\"Trưa\"},{\"mealName\":\"Cá chiên với rau xào\",\"quantity\":\"1 đĩa (100g cá, 200g rau)\",\"calories\":380,\"type\":\"Tối\"},{\"mealName\":\"Sữa chua không đường\",\"quantity\":\"1 hộp (200g)\",\"calories\":80,\"type\":\"Phụ\"}],\"weeks\":[{\"week\":1,\"title\":\"Tăng cường chất xơ\",\"nutritionFocus\":\"Nạp nhiều chất xơ, giảm tinh bột nhanh\",\"mealTips\":\"Bắt đầu ngày mới với nước chanh ấm, ăn nhiều rau xanh trong bữa trưa\",\"note\":\"Hạn chế đồ uống có gas\"},{\"week\":2,\"title\":\"Cân bằng đạm\",\"nutritionFocus\":\"Tăng cường đạm từ thực vật và động vật\",\"mealTips\":\"Bổ sung thêm các loại đậu vào bữa ăn hàng ngày\",\"note\":\"Giảm tiêu thụ thịt đỏ\"},{\"week\":3,\"title\":\"Tối ưu hóa bữa ăn\",\"nutritionFocus\":\"Tối ưu hóa bữa ăn với các thực phẩm giàu dinh dưỡng\",\"mealTips\":\"Sử dụng dầu ô liu trong nấu ăn\",\"note\":\"Hạn chế thực phẩm chế biến sẵn\"},{\"week\":4,\"title\":\"Duy trì và điều chỉnh\",\"nutritionFocus\":\"Duy trì chế độ ăn uống cân bằng\",\"mealTips\":\"Theo dõi và điều chỉnh chế độ ăn uống dựa trên phản hồi của cơ thể\",\"note\":\"Chuẩn bị cho giai đoạn tiếp theo\"}],\"note\":\"Luôn theo dõi cân nặng và điều chỉnh chế độ ăn uống cho phù hợp.\"},{\"month\":2,\"title\":\"Tăng cường sức khỏe\",\"dailyCalories\":2250,\"macronutrients\":\"Đạm: 130g (22%)- Béo: 75g (32%)- Tinh bột: 260g (46%)\",\"habitFocus\":\"Tăng cường hoạt động thể chất và duy trì chế độ ăn uống cân bằng.\",\"mealTips\":\"Bổ sung thêm các loại vitamin và khoáng chất cần thiết.\",\"specificActions\":\"- Uống 2L nước lọc mỗi ngày. - Đi bộ nhanh 15p sau mỗi bữa ăn chính. - Ngủ đủ 8 tiếng, bắt đầu từ 22h.\",\"sampleDailyMeals\":[{\"mealName\":\"Bánh cuốn thịt lợn\",\"quantity\":\"1 đĩa (200g bánh cuốn, 100g thịt)\",\"calories\":500,\"type\":\"Sáng\"},{\"mealName\":\"Cơm gà nướng\",\"quantity\":\"1 đĩa (1 bát cơm trắng, 100g gà)\",\"calories\":520,\"type\":\"Trưa\"},{\"mealName\":\"Cá hấp với rau xanh\",\"quantity\":\"1 đĩa (100g cá, 200g rau)\",\"calories\":300,\"type\":\"Tối\"},{\"mealName\":\"Trái cây tươi\",\"quantity\":\"1 đĩa (200g)\",\"calories\":60,\"type\":\"Phụ\"}],\"weeks\":[{\"week\":1,\"title\":\"Tăng cường vitamin\",\"nutritionFocus\":\"Nạp nhiều vitamin và khoáng chất\",\"mealTips\":\"Ăn nhiều trái cây và rau xanh\",\"note\":\"Hạn chế đồ uống có caffeine\"},{\"week\":2,\"title\":\"Cân bằng lipid\",\"nutritionFocus\":\"Tối ưu hóa lipid trong chế độ ăn uống\",\"mealTips\":\"Bổ sung thêm các loại hạt và dầu thực vật\",\"note\":\"Giảm tiêu thụ thực phẩm chiên rán\"},{\"week\":3,\"title\":\"Tăng cường sức khỏe đường ruột\",\"nutritionFocus\":\"Duy trì sức khỏe đường ruột\",\"mealTips\":\"Bổ sung thêm probiotics và prebiotics\",\"note\":\"Hạn chế thực phẩm khó tiêu hóa\"},{\"week\":4,\"title\":\"Duy trì và điều chỉnh\",\"nutritionFocus\":\"Duy trì chế độ ăn uống cân bằng\",\"mealTips\":\"Theo dõi và điều chỉnh chế độ ăn uống dựa trên phản hồi của cơ thể\",\"note\":\"Chuẩn bị cho giai đoạn tiếp theo\"}],\"note\":\"Luôn theo dõi cân nặng và điều chỉnh chế độ ăn uống cho phù hợp.\"},{\"month\":3,\"title\":\"Hoàn thiện và duy trì\",\"dailyCalories\":2200,\"macronutrients\":\"Đạm: 120g (20%)- Béo: 70g (30%)- Tinh bột: 250g (50%)\",\"habitFocus\":\"Duy trì chế độ ăn uống cân bằng và tăng cường hoạt động thể chất.\",\"mealTips\":\"Bổ sung thêm các loại thực phẩm giàu dinh dưỡng\",\"specificActions\":\"- Uống 2L nước lọc mỗi ngày. - Đi bộ nhanh 10p sau mỗi bữa ăn chính. - Ngủ đủ 8 tiếng, bắt đầu từ 22h.\",\"sampleDailyMeals\":[{\"mealName\":\"Phở bò\",\"quantity\":\"1 bát tô vừa (150g bánh phở)\",\"calories\":450,\"type\":\"Sáng\"},{\"mealName\":\"Cơm cá chiên\",\"quantity\":\"1 đĩa (1 bát cơm trắng, 100g cá)\",\"calories\":500,\"type\":\"Trưa\"},{\"mealName\":\"Rau xào với thịt gà\",\"quantity\":\"1 đĩa (200g rau, 100g thịt)\",\"calories\":320,\"type\":\"Tối\"},{\"mealName\":\"Sữa chua\",\"quantity\":\"1 hộp (200g)\",\"calories\":100,\"type\":\"Phụ\"}],\"weeks\":[{\"week\":1,\"title\":\"Duy trì chế độ ăn uống\",\"nutritionFocus\":\"Duy trì chế độ ăn uống cân bằng\",\"mealTips\":\"Theo dõi và điều chỉnh chế độ ăn uống dựa trên phản hồi của cơ thể\",\"note\":\"Chuẩn bị cho giai đoạn duy trì lâu dài\"},{\"week\":2,\"title\":\"Tăng cường hoạt động thể chất\",\"nutritionFocus\":\"Tăng cường hoạt động thể chất\",\"mealTips\":\"Bổ sung thêm các loại thực phẩm hỗ trợ hoạt động thể chất\",\"note\":\"Hạn chế thực phẩm khó tiêu hóa\"},{\"week\":3,\"title\":\"Duy trì và điều chỉnh\",\"nutritionFocus\":\"Duy trì chế độ ăn uống cân bằng\",\"mealTips\":\"Theo dõi và điều chỉnh chế độ ăn uống dựa trên phản hồi của cơ thể\",\"note\":\"Chuẩn bị cho giai đoạn tiếp theo\"},{\"week\":4,\"title\":\"Kết thúc và đánh giá\",\"nutritionFocus\":\"Đánh giá kết quả đạt được\",\"mealTips\":\"Lập kế hoạch cho giai đoạn tiếp theo\",\"note\":\"Duy trì chế độ ăn uống cân bằng và hoạt động thể chất\"}],\"note\":\"Luôn theo dõi cân nặng và điều chỉnh chế độ ăn uống cho phù hợp.\"}]}}', '2026-01-29 16:32:09.000000', '2026-01-29 16:32:09.000000', 26);

-- --------------------------------------------------------

--
-- Table structure for table `health_profiles`
--

CREATE TABLE `health_profiles` (
  `user_id` bigint(20) NOT NULL,
  `activity_level` enum('LIGHT','MODERATE','SEDENTARY','VERY_ACTIVE') NOT NULL,
  `age` int(11) NOT NULL,
  `gender` enum('FEMALE','MALE','OTHER') NOT NULL,
  `height` double NOT NULL,
  `last_modified_at` datetime(6) DEFAULT NULL,
  `sleep_duration` enum('FIVE_TO_SEVEN','LESS_THAN_FIVE','MORE_THAN_NINE','SEVEN_TO_NINE') NOT NULL,
  `stress_level` enum('HIGH','LOW','MEDIUM','VERY_HIGH') NOT NULL,
  `weight` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `health_profiles`
--

INSERT INTO `health_profiles` (`user_id`, `activity_level`, `age`, `gender`, `height`, `last_modified_at`, `sleep_duration`, `stress_level`, `weight`) VALUES
(2, 'MODERATE', 28, 'MALE', 175, '2026-01-27 16:00:13.000000', 'SEVEN_TO_NINE', 'MEDIUM', 85),
(3, 'MODERATE', 24, 'FEMALE', 160, '2026-01-27 16:00:13.000000', 'SEVEN_TO_NINE', 'MEDIUM', 47),
(4, 'MODERATE', 22, 'MALE', 172, '2026-01-27 16:00:13.000000', 'SEVEN_TO_NINE', 'MEDIUM', 68),
(5, 'MODERATE', 30, 'MALE', 168, '2026-01-27 16:00:13.000000', 'SEVEN_TO_NINE', 'MEDIUM', 92),
(6, 'MODERATE', 26, 'FEMALE', 155, '2026-01-27 16:00:13.000000', 'SEVEN_TO_NINE', 'MEDIUM', 55),
(7, 'MODERATE', 29, 'MALE', 180, '2026-01-27 16:00:13.000000', 'SEVEN_TO_NINE', 'MEDIUM', 75),
(8, 'MODERATE', 25, 'FEMALE', 165, '2026-01-27 16:00:13.000000', 'SEVEN_TO_NINE', 'MEDIUM', 60),
(9, 'MODERATE', 23, 'MALE', 170, '2026-01-27 16:00:13.000000', 'SEVEN_TO_NINE', 'MEDIUM', 50),
(10, 'MODERATE', 35, 'FEMALE', 158, '2026-01-27 16:00:13.000000', 'SEVEN_TO_NINE', 'MEDIUM', 65),
(11, 'MODERATE', 27, 'MALE', 178, '2026-01-27 16:00:14.000000', 'SEVEN_TO_NINE', 'MEDIUM', 80),
(12, 'MODERATE', 21, 'FEMALE', 162, '2026-01-27 16:00:14.000000', 'SEVEN_TO_NINE', 'MEDIUM', 49),
(13, 'MODERATE', 32, 'MALE', 165, '2026-01-27 16:00:14.000000', 'SEVEN_TO_NINE', 'MEDIUM', 65),
(14, 'MODERATE', 24, 'FEMALE', 170, '2026-01-27 16:00:14.000000', 'SEVEN_TO_NINE', 'MEDIUM', 58),
(15, 'MODERATE', 28, 'MALE', 174, '2026-01-27 16:00:14.000000', 'SEVEN_TO_NINE', 'MEDIUM', 88),
(16, 'MODERATE', 20, 'FEMALE', 150, '2026-01-27 16:00:14.000000', 'SEVEN_TO_NINE', 'MEDIUM', 40),
(17, 'MODERATE', 29, 'MALE', 182, '2026-01-27 16:00:14.000000', 'SEVEN_TO_NINE', 'MEDIUM', 82),
(18, 'MODERATE', 26, 'MALE', 169, '2026-01-27 16:00:14.000000', 'SEVEN_TO_NINE', 'MEDIUM', 72),
(19, 'MODERATE', 31, 'FEMALE', 160, '2026-01-27 16:00:14.000000', 'SEVEN_TO_NINE', 'MEDIUM', 52),
(20, 'MODERATE', 33, 'MALE', 176, '2026-01-27 16:00:15.000000', 'SEVEN_TO_NINE', 'MEDIUM', 78),
(21, 'MODERATE', 70, 'FEMALE', 155, '2026-01-27 16:00:15.000000', 'SEVEN_TO_NINE', 'MEDIUM', 50),
(22, 'SEDENTARY', 28, 'MALE', 180, '2026-01-28 12:31:32.000000', 'SEVEN_TO_NINE', 'VERY_HIGH', 60),
(24, 'SEDENTARY', 25, 'MALE', 180, '2026-01-28 12:43:34.000000', 'SEVEN_TO_NINE', 'VERY_HIGH', 60),
(25, 'SEDENTARY', 30, 'FEMALE', 170, '2026-01-28 16:20:47.000000', 'SEVEN_TO_NINE', 'LOW', 100),
(26, 'SEDENTARY', 28, 'MALE', 161, '2026-01-29 16:32:03.000000', 'SEVEN_TO_NINE', 'LOW', 61);

-- --------------------------------------------------------

--
-- Table structure for table `meal_plans`
--

CREATE TABLE `meal_plans` (
  `id` bigint(20) NOT NULL,
  `start_date` date NOT NULL,
  `total_days` int(11) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meal_plans`
--

INSERT INTO `meal_plans` (`id`, `start_date`, `total_days`, `updated_at`, `user_id`) VALUES
(1, '2026-01-28', 7, '2026-01-28 12:33:01.000000', 22),
(3, '2026-01-28', 7, '2026-01-28 16:02:28.000000', 24),
(5, '2026-01-28', 7, '2026-01-28 16:34:20.000000', 25),
(6, '2026-01-29', 7, '2026-01-29 16:33:23.000000', 26);

-- --------------------------------------------------------

--
-- Table structure for table `planned_meals`
--

CREATE TABLE `planned_meals` (
  `id` bigint(20) NOT NULL,
  `calories` int(11) DEFAULT NULL,
  `category` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `day_number` int(11) NOT NULL,
  `meal_name` varchar(255) DEFAULT NULL,
  `meal_plan_id` bigint(20) NOT NULL,
  `quantity` varchar(255) DEFAULT NULL,
  `dish_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `planned_meals`
--

INSERT INTO `planned_meals` (`id`, `calories`, `category`, `created_at`, `day_number`, `meal_name`, `meal_plan_id`, `quantity`, `dish_id`) VALUES
(1, 400, 'Sáng', '2026-01-28 12:33:03.000000', 1, 'Phở gà', 1, '1 bát', 2),
(2, 250, 'Trưa', '2026-01-28 12:33:03.000000', 1, 'Cá kho tộ', 1, '1 đĩa', 27),
(3, 180, 'Tối', '2026-01-28 12:33:03.000000', 1, 'Cá lóc hấp bầu', 1, '1 miếng', 52),
(4, 150, 'Phụ', '2026-01-28 12:33:03.000000', 1, 'Trái cây tô', 1, '1 tô', 80),
(5, 450, 'Sáng', '2026-01-28 12:33:03.000000', 2, 'Phở bò', 1, '1 bát', 1),
(6, 100, 'Trưa', '2026-01-28 12:33:03.000000', 2, 'Rau muống xào tỏi', 1, '1 đĩa', 30),
(7, 280, 'Tối', '2026-01-28 12:33:03.000000', 2, 'Gà kho gừng', 1, '1 miếng', 66),
(8, 80, 'Phụ', '2026-01-28 12:33:03.000000', 2, 'Thạch rau câu', 1, '1 bát', 84),
(9, 500, 'Sáng', '2026-01-28 12:33:03.000000', 3, 'Bún chả', 1, '1 bát', 3),
(10, 150, 'Trưa', '2026-01-28 12:33:03.000000', 3, 'Trứng chiên', 1, '1 đĩa', 36),
(11, 220, 'Tối', '2026-01-28 12:33:03.000000', 3, 'Tôm rim mặn ngọt', 1, '1 miếng', 53),
(12, 120, 'Phụ', '2026-01-28 12:33:03.000000', 3, 'Khoai lang tím luộc', 1, '1 củ', 88),
(13, 350, 'Sáng', '2026-01-28 12:33:03.000000', 4, 'Bánh mì thịt', 1, '1 cái', 5),
(14, 450, 'Trưa', '2026-01-28 12:33:03.000000', 4, 'Bò kho', 1, '1 đĩa', 42),
(15, 70, 'Tối', '2026-01-28 12:33:03.000000', 4, 'Canh bí xanh nấu tôm', 1, '1 bát', 61),
(16, 200, 'Phụ', '2026-01-28 12:33:03.000000', 4, 'Chè đỗ đen', 1, '1 bát', 77),
(17, 300, 'Sáng', '2026-01-28 12:33:03.000000', 5, 'Bánh mì trứng', 1, '1 cái', 6),
(18, 300, 'Trưa', '2026-01-28 12:33:03.000000', 5, 'Gà rang sả ớt', 1, '1 đĩa', 29),
(19, 40, 'Tối', '2026-01-28 12:33:03.000000', 5, 'Đậu bắp luộc', 1, '1 quả', 54),
(20, 50, 'Phụ', '2026-01-28 12:33:03.000000', 5, 'Quả cam', 1, '1 quả', 81),
(21, 450, 'Sáng', '2026-01-28 12:33:03.000000', 6, 'Xôi xéo', 1, '1 gói', 7),
(22, 350, 'Trưa', '2026-01-28 12:33:03.000000', 6, 'Tôm rang thịt ba chỉ', 1, '1 đĩa', 38),
(23, 60, 'Tối', '2026-01-28 12:33:03.000000', 6, 'Gỏi cuốn', 1, '1 đĩa', 57),
(24, 120, 'Phụ', '2026-01-28 12:33:03.000000', 6, 'Sữa tươi không đường', 1, '1 hộp', 86),
(25, 480, 'Sáng', '2026-01-28 12:33:03.000000', 7, 'Bún bò Huế', 1, '1 bát', 4),
(26, 400, 'Trưa', '2026-01-28 12:33:03.000000', 7, 'Nem rán (Chả giò)', 1, '2 cái', 44),
(27, 120, 'Tối', '2026-01-28 12:33:03.000000', 7, 'Bí đỏ xào tỏi', 1, '1 đĩa', 58),
(28, 90, 'Phụ', '2026-01-28 12:33:03.000000', 7, 'Quả chuối', 1, '1 quả', 83),
(57, 400, 'Sáng', '2026-01-28 16:02:30.000000', 1, 'Phở gà', 3, '1 bát', 2),
(58, 250, 'Trưa', '2026-01-28 16:02:30.000000', 1, 'Cá kho tộ', 3, '1 con cá', 27),
(59, 250, 'Tối', '2026-01-28 16:02:30.000000', 1, 'Gà luộc', 3, '1 con gà', 43),
(60, 150, 'Phụ', '2026-01-28 16:02:30.000000', 1, 'Trái cây tô', 3, '1 tô', 80),
(61, 450, 'Sáng', '2026-01-28 16:02:30.000000', 2, 'Phở bò', 3, '1 bát', 1),
(62, 100, 'Trưa', '2026-01-28 16:02:30.000000', 2, 'Rau muống xào tỏi', 3, '1 đĩa', 30),
(63, 220, 'Tối', '2026-01-28 16:02:30.000000', 2, 'Tôm rim mặn ngọt', 3, '1 đĩa', 53),
(64, 80, 'Phụ', '2026-01-28 16:02:30.000000', 2, 'Thạch rau câu', 3, '1 bát', 84),
(65, 500, 'Sáng', '2026-01-28 16:02:30.000000', 3, 'Bún chả', 3, '1 đĩa', 3),
(66, 280, 'Trưa', '2026-01-28 16:02:30.000000', 3, 'Gà kho gừng', 3, '1 con gà', 66),
(67, 40, 'Tối', '2026-01-28 16:02:30.000000', 3, 'Đậu bắp luộc', 3, '1 đĩa', 54),
(68, 120, 'Phụ', '2026-01-28 16:02:30.000000', 3, 'Khoai lang tím luộc', 3, '1 củ', 88),
(69, 480, 'Sáng', '2026-01-28 16:02:30.000000', 4, 'Bún bò Huế', 3, '1 bát', 4),
(70, 350, 'Trưa', '2026-01-28 16:02:30.000000', 4, 'Thịt kho tàu', 3, '1 đĩa', 28),
(71, 400, 'Tối', '2026-01-28 16:02:30.000000', 4, 'Nem rán (Chả giò)', 3, '2 cái', 44),
(72, 50, 'Phụ', '2026-01-28 16:02:30.000000', 4, 'Quả cam', 3, '1 quả', 81),
(73, 350, 'Sáng', '2026-01-28 16:02:30.000000', 5, 'Bánh mì thịt', 3, '1 cái', 5),
(74, 300, 'Trưa', '2026-01-28 16:02:30.000000', 5, 'Gà rang sả ớt', 3, '1 đĩa', 29),
(75, 50, 'Tối', '2026-01-28 16:02:30.000000', 5, 'Canh đại dương', 3, '1 bát', 55),
(76, 160, 'Phụ', '2026-01-28 16:02:30.000000', 5, 'Bánh flan', 3, '1 cái', 85),
(77, 300, 'Sáng', '2026-01-28 16:02:30.000000', 6, 'Bánh mì trứng', 3, '1 cái', 6),
(78, 200, 'Trưa', '2026-01-28 16:02:30.000000', 6, 'Đậu phụ sốt cà chua', 3, '1 đĩa', 31),
(79, 100, 'Tối', '2026-01-28 16:02:30.000000', 6, 'Canh rau ngót nấu thịt băm', 3, '1 đĩa', 45),
(80, 60, 'Phụ', '2026-01-28 16:02:30.000000', 6, 'Quả táo', 3, '1 quả', 82),
(81, 450, 'Sáng', '2026-01-28 16:02:30.000000', 7, 'Xôi xéo', 3, '1 đĩa', 7),
(82, 150, 'Trưa', '2026-01-28 16:02:30.000000', 7, 'Canh chua cá lóc', 3, '1 bát', 32),
(83, 200, 'Tối', '2026-01-28 16:02:30.000000', 7, 'Giá đỗ xào lòng gà', 3, '1 đĩa', 46),
(84, 90, 'Phụ', '2026-01-28 16:02:30.000000', 7, 'Quả chuối', 3, '1 quả', 83),
(85, 400, 'Sáng', '2026-01-28 16:30:26.000000', 1, 'Phở gà', 4, '1 bát', 2),
(86, 250, 'Trưa', '2026-01-28 16:30:26.000000', 1, 'Cá kho tộ', 4, '1 con', 27),
(87, 180, 'Tối', '2026-01-28 16:30:26.000000', 1, 'Cá lóc hấp bầu', 4, '1 con', 52),
(88, 150, 'Phụ', '2026-01-28 16:30:26.000000', 1, 'Trái cây tô', 4, '1 tô', 80),
(89, 300, 'Sáng', '2026-01-28 16:30:26.000000', 2, 'Cháo gà', 4, '1 bát', 12),
(90, 100, 'Trưa', '2026-01-28 16:30:26.000000', 2, 'Rau muống xào tỏi', 4, '1 đĩa', 30),
(91, 280, 'Tối', '2026-01-28 16:30:26.000000', 2, 'Gà kho gừng', 4, '1 con', 66),
(92, 80, 'Phụ', '2026-01-28 16:30:26.000000', 2, 'Thạch rau câu', 4, '1 bát', 84),
(93, 300, 'Sáng', '2026-01-28 16:30:26.000000', 3, 'Bánh mì trứng', 4, '1 cái', 6),
(94, 150, 'Trưa', '2026-01-28 16:30:26.000000', 3, 'Trứng chiên', 4, '2 quả', 36),
(95, 220, 'Tối', '2026-01-28 16:30:26.000000', 3, 'Tôm rim mặn ngọt', 4, '1 đĩa', 53),
(96, 120, 'Phụ', '2026-01-28 16:30:26.000000', 3, 'Khoai lang tím luộc', 4, '1 củ', 88),
(97, 350, 'Sáng', '2026-01-28 16:30:26.000000', 4, 'Bánh mì thịt', 4, '1 cái', 5),
(98, 300, 'Trưa', '2026-01-28 16:30:26.000000', 4, 'Chả lá lốt', 4, '1 đĩa', 41),
(99, 90, 'Tối', '2026-01-28 16:30:26.000000', 4, 'Bắp cải xào', 4, '1 đĩa', 62),
(100, 40, 'Phụ', '2026-01-28 16:30:26.000000', 4, 'Nước ép cần tây', 4, '1 ly', 91),
(101, 350, 'Sáng', '2026-01-28 16:30:26.000000', 5, 'Bánh cuốn', 4, '1 cuốn', 9),
(102, 400, 'Trưa', '2026-01-28 16:30:26.000000', 5, 'Nem rán (Chả giò)', 4, '2 cái', 44),
(103, 40, 'Tối', '2026-01-28 16:30:26.000000', 5, 'Đậu bắp luộc', 4, '1 đĩa', 54),
(104, 120, 'Phụ', '2026-01-28 16:30:26.000000', 5, 'Sữa tươi không đường', 4, '1 ly', 86),
(105, 300, 'Sáng', '2026-01-28 16:30:26.000000', 6, 'Bánh giò', 4, '1 cái', 10),
(106, 150, 'Trưa', '2026-01-28 16:30:26.000000', 6, 'Canh chua cá lóc', 4, '1 bát', 32),
(107, 60, 'Tối', '2026-01-28 16:30:26.000000', 6, 'Gỏi cuốn', 4, '1 đĩa', 57),
(108, 50, 'Phụ', '2026-01-28 16:30:26.000000', 6, 'Quả cam', 4, '1 quả', 81),
(109, 450, 'Sáng', '2026-01-28 16:30:26.000000', 7, 'Phở bò', 4, '1 bát', 1),
(110, 350, 'Trưa', '2026-01-28 16:30:26.000000', 7, 'Tôm rang thịt ba chỉ', 4, '1 đĩa', 38),
(111, 120, 'Tối', '2026-01-28 16:30:26.000000', 7, 'Bí đỏ xào tỏi', 4, '1 đĩa', 58),
(112, 90, 'Phụ', '2026-01-28 16:30:26.000000', 7, 'Quả chuối', 4, '1 quả', 83),
(113, 400, 'Sáng', '2026-01-28 16:34:23.000000', 1, 'Phở gà', 5, '1 bát', 2),
(114, 250, 'Trưa', '2026-01-28 16:34:23.000000', 1, 'Cá kho tộ', 5, '1 đĩa', 27),
(115, 180, 'Tối', '2026-01-28 16:34:23.000000', 1, 'Cá lóc hấp bầu', 5, '1 con', 52),
(116, 150, 'Phụ', '2026-01-28 16:34:23.000000', 1, 'Trái cây tô', 5, '1 tô', 80),
(117, 300, 'Sáng', '2026-01-28 16:34:23.000000', 2, 'Cháo gà', 5, '1 bát', 12),
(118, 100, 'Trưa', '2026-01-28 16:34:23.000000', 2, 'Rau muống xào tỏi', 5, '1 đĩa', 30),
(119, 280, 'Tối', '2026-01-28 16:34:23.000000', 2, 'Gà kho gừng', 5, '1 đĩa', 66),
(120, 50, 'Phụ', '2026-01-28 16:34:23.000000', 2, 'Quả cam', 5, '1 quả', 81),
(121, 350, 'Sáng', '2026-01-28 16:34:23.000000', 3, 'Bánh mì thịt', 5, '1 cái', 5),
(122, 150, 'Trưa', '2026-01-28 16:34:23.000000', 3, 'Trứng chiên', 5, '1 đĩa', 36),
(123, 220, 'Tối', '2026-01-28 16:34:23.000000', 3, 'Tôm rim mặn ngọt', 5, '1 đĩa', 53),
(124, 120, 'Phụ', '2026-01-28 16:34:23.000000', 3, 'Khoai lang tím luộc', 5, '1 củ', 88),
(125, 300, 'Sáng', '2026-01-28 16:34:23.000000', 4, 'Bánh mì trứng', 5, '1 cái', 6),
(126, 130, 'Trưa', '2026-01-28 16:34:23.000000', 4, 'Cơm trắng', 5, '1 bát', 26),
(127, 300, 'Tối', '2026-01-28 16:34:23.000000', 4, 'Chả lá lốt', 5, '1 đĩa', 41),
(128, 80, 'Phụ', '2026-01-28 16:34:23.000000', 4, 'Thạch rau câu', 5, '1 chén', 84),
(129, 350, 'Sáng', '2026-01-28 16:34:23.000000', 5, 'Bánh cuốn', 5, '1 cuốn', 9),
(130, 250, 'Trưa', '2026-01-28 16:34:23.000000', 5, 'Bò xào thiên lý', 5, '1 đĩa', 34),
(131, 40, 'Tối', '2026-01-28 16:34:23.000000', 5, 'Đậu bắp luộc', 5, '1 chén', 54),
(132, 120, 'Phụ', '2026-01-28 16:34:23.000000', 5, 'Sữa tươi không đường', 5, '1 hộp', 86),
(133, 300, 'Sáng', '2026-01-28 16:34:23.000000', 6, 'Bánh giò', 5, '1 cái', 10),
(134, 300, 'Trưa', '2026-01-28 16:34:23.000000', 6, 'Gà rang sả ớt', 5, '1 đĩa', 29),
(135, 60, 'Tối', '2026-01-28 16:34:23.000000', 6, 'Gỏi cuốn', 5, '1 đĩa', 57),
(136, 90, 'Phụ', '2026-01-28 16:34:23.000000', 6, 'Quả chuối', 5, '1 quả', 83),
(137, 450, 'Sáng', '2026-01-28 16:34:23.000000', 7, 'Phở bò', 5, '1 bát', 1),
(138, 550, 'Trưa', '2026-01-28 16:34:23.000000', 7, 'Bún đậu mắm tôm', 5, '1 đĩa', 25),
(139, 600, 'Tối', '2026-01-28 16:34:23.000000', 7, 'Cơm rang dưa bò', 5, '1 đĩa', 50),
(140, 60, 'Phụ', '2026-01-28 16:34:23.000000', 7, 'Quả táo', 5, '1 quả', 82),
(141, 400, 'Sáng', '2026-01-29 16:33:26.000000', 1, 'Phở gà', 6, '1 bát', 2),
(142, 250, 'Trưa', '2026-01-29 16:33:26.000000', 1, 'Cá kho tộ', 6, '1 con', 27),
(143, 250, 'Tối', '2026-01-29 16:33:26.000000', 1, 'Gà luộc', 6, '1 con', 43),
(144, 150, 'Phụ', '2026-01-29 16:33:26.000000', 1, 'Trái cây tô', 6, '1 tô', 80),
(145, 450, 'Sáng', '2026-01-29 16:33:26.000000', 2, 'Phở bò', 6, '1 bát', 1),
(146, 100, 'Trưa', '2026-01-29 16:33:26.000000', 2, 'Rau muống xào tỏi', 6, '1 đĩa', 30),
(147, 280, 'Tối', '2026-01-29 16:33:26.000000', 2, 'Gà kho gừng', 6, '1 đĩa', 66),
(148, 80, 'Phụ', '2026-01-29 16:33:26.000000', 2, 'Thạch rau câu', 6, '1 chén', 84),
(149, 300, 'Sáng', '2026-01-29 16:33:26.000000', 3, 'Bánh mì trứng', 6, '1 cái', 6),
(150, 200, 'Trưa', '2026-01-29 16:33:26.000000', 3, 'Mực xào cần tỏi', 6, '1 đĩa', 35),
(151, 220, 'Tối', '2026-01-29 16:33:26.000000', 3, 'Tôm rim mặn ngọt', 6, '1 đĩa', 53),
(152, 120, 'Phụ', '2026-01-29 16:33:26.000000', 3, 'Khoai lang tím luộc', 6, '1 củ', 88),
(153, 350, 'Sáng', '2026-01-29 16:33:26.000000', 4, 'Bánh mì thịt', 6, '1 cái', 5),
(154, 300, 'Trưa', '2026-01-29 16:33:26.000000', 4, 'Chả lá lốt', 6, '1 đĩa', 41),
(155, 230, 'Tối', '2026-01-29 16:33:26.000000', 4, 'Cá hường chiên', 6, '1 đĩa', 60),
(156, 50, 'Phụ', '2026-01-29 16:33:26.000000', 4, 'Quả cam', 6, '1 quả', 81),
(157, 500, 'Sáng', '2026-01-29 16:33:26.000000', 5, 'Bún chả', 6, '1 đĩa', 3),
(158, 200, 'Trưa', '2026-01-29 16:33:26.000000', 5, 'Giá đỗ xào lòng gà', 6, '1 đĩa', 46),
(159, 40, 'Tối', '2026-01-29 16:33:26.000000', 5, 'Đậu bắp luộc', 6, '1 chùm', 54),
(160, 120, 'Phụ', '2026-01-29 16:33:26.000000', 5, 'Sữa tươi không đường', 6, '1 hộp', 86),
(161, 480, 'Sáng', '2026-01-29 16:33:26.000000', 6, 'Bún bò Huế', 6, '1 bát', 4),
(162, 350, 'Trưa', '2026-01-29 16:33:26.000000', 6, 'Tôm rang thịt ba chỉ', 6, '1 đĩa', 38),
(163, 90, 'Tối', '2026-01-29 16:33:26.000000', 6, 'Bắp cải xào', 6, '1 đĩa', 62),
(164, 150, 'Phụ', '2026-01-29 16:33:26.000000', 6, 'Ngô luộc', 6, '1 bắp', 89),
(165, 450, 'Sáng', '2026-01-29 16:33:26.000000', 7, 'Xôi xéo', 6, '1 gói', 7),
(166, 150, 'Trưa', '2026-01-29 16:33:26.000000', 7, 'Canh chua cá lóc', 6, '1 bát', 32),
(167, 250, 'Tối', '2026-01-29 16:33:26.000000', 7, 'Thịt bò trộn dầu giấm', 6, '1 đĩa', 59),
(168, 160, 'Phụ', '2026-01-29 16:33:26.000000', 7, 'Bánh flan', 6, '1 bánh', 85);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `is_premium` bit(1) NOT NULL,
  `last_modified_at` datetime(6) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('ADMIN','USER') NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `created_at`, `email`, `full_name`, `is_premium`, `last_modified_at`, `password_hash`, `role`, `status`) VALUES
(1, '2026-01-27 16:00:12.000000', 'admin@aihealth.com', 'System Admin', b'1', '2026-01-27 16:00:12.000000', '$2a$10$gMpYVSU03Qk2AST8Stpxg.zCyYZyqZw5l6v6VLY2eMXMlfAknswiC', 'ADMIN', 1),
(2, '2026-01-27 16:00:13.000000', 'nam.nh98@gmail.com', 'Nguyễn Hoàng Nam', b'0', '2026-01-27 16:00:13.000000', '$2a$10$pEPQBsGM1hg3FQtqgrs93e9/Lqlx1MZTOZjN41GbOBvcx0nJJtWIi', 'USER', 1),
(3, '2026-01-20 16:00:13.000000', 'thaottt.2001@gmail.com', 'Trần Thị Thanh Thảo', b'0', '2026-01-27 16:00:13.000000', '$2a$10$r0jPEuSA.BD5glCytszhJuc0KrflB4AjuGPFGdf.RixDlxG3uXh4i', 'USER', 1),
(4, '2026-01-12 16:00:13.000000', 'baolg.dev99@gmail.com', 'Lê Gia Bảo', b'0', '2026-01-27 16:00:13.000000', '$2a$10$T4VgPGsM3bArjvBYkVE1Leftu2ReZGJxonyl.e1H9lFXN5.gAZhq.', 'USER', 1),
(5, '2026-01-07 16:00:13.000000', 'tuanpm.hust@gmail.com', 'Phạm Minh Tuấn', b'0', '2026-01-27 16:00:13.000000', '$2a$10$Cwb8xPErviD2PLdmViEgLeQnSx01cYvsA3IJbmhGhnXYkniOufZj.', 'USER', 1),
(6, '2026-01-27 16:00:13.000000', 'bichhn_2003@gmail.com', 'Hoàng Ngọc Bích', b'0', '2026-01-27 16:00:13.000000', '$2a$10$zyupTzus4/P3vvTd45ViheK4vM4zKtHZY7L2dCvt6cnflBsyDfMQ6', 'USER', 1),
(7, '2026-01-27 16:00:13.000000', 'dungda.fpt@gmail.com', 'Đỗ Anh Dũng', b'0', '2026-01-27 16:00:13.000000', '$2a$10$jhiDamg.lLKVbUSQnj1DjepsJsRkSatyeCjrnscPICkfxN9mRi7Aa', 'USER', 1),
(8, '2026-01-13 16:00:13.000000', 'maipt.95@gmail.com', 'Phan Tuyết Mai', b'0', '2026-01-27 16:00:13.000000', '$2a$10$Frd3QXGivVPuZk8uoIBlG.S0TrsqT.CVi3odMvjzqdDGmrP1AySTK', 'USER', 1),
(9, '2026-01-27 16:00:13.000000', 'huyvq.it2002@gmail.com', 'Vũ Quang Huy', b'0', '2026-01-27 16:00:13.000000', '$2a$10$yxOyoxeOlDCJgGZUwiOhX.wY1x.M3ficdU9YCfggJBF9JDJXVCXta', 'USER', 1),
(10, '2026-01-27 16:00:13.000000', 'chidk.64@gmail.com', 'Đặng Kim Chi', b'0', '2026-01-27 16:00:13.000000', '$2a$10$F9kxjDrC77U6J3DkwRCJAey0pqf2k3sCVNrxX24Y2nNmCeE2BcIbe', 'USER', 1),
(11, '2026-01-27 16:00:14.000000', 'trietbm.2701@gmail.com', 'Bùi Minh Triết', b'0', '2026-01-27 16:00:14.000000', '$2a$10$fSjHioLlM1hrfI9D.gSkeut5ngFe0nmxawE.kdHqg2asv.6PqyLye', 'USER', 1),
(12, '2026-01-05 16:00:14.000000', 'trangtt.kt@gmail.com', 'Trịnh Thu Trang', b'0', '2026-01-27 16:00:14.000000', '$2a$10$2aemsq60lK7Vke0NVh32f.ISBSh5sVgNNncHBEnvmFqJuWY1Id4Pu', 'USER', 1),
(13, '2026-01-12 16:00:14.000000', 'hungnv.88@gmail.com', 'Ngô Văn Hùng', b'0', '2026-01-27 16:00:14.000000', '$2a$10$gbDoVTQmxBM2YnadsPP5o.bWpX64fry7PwRAhPU7FlB4I3aPGZ5Fy', 'USER', 1),
(14, '2026-01-27 16:00:14.000000', 'linhdp.fresher@gmail.com', 'Đào Phương Linh', b'0', '2026-01-27 16:00:14.000000', '$2a$10$0cfFllM/UHaAaTatWSXBeuQY8Ohzzf0AufCAKojECRrxz2HeauClG', 'USER', 1),
(15, '2026-01-18 16:00:14.000000', 'tunglt.1997@gmail.com', 'Lý Thanh Tùng', b'0', '2026-01-27 16:00:14.000000', '$2a$10$XR9cimJU5dFuk6oTFMwEoOBWYyf9all6R08C24NLT8NearscHdFBS', 'USER', 1),
(16, '2026-01-27 16:00:14.000000', 'huyendm.2k5@gmail.com', 'Dương Mỹ Huyền', b'0', '2026-01-27 16:00:14.000000', '$2a$10$ZntxKEClyPZw80dwpOrVwOpMyXize/csmpo8JNeVDEjlF1DwqG/.e', 'USER', 1),
(17, '2026-01-04 16:00:14.000000', 'anhcq.work@gmail.com', 'Chu Quốc Anh', b'0', '2026-01-27 16:00:14.000000', '$2a$10$NfPfPPsFkKURrApUwPx9HetyU1ABM/iW5fEDd/uBhzf/LmnlE1gba', 'USER', 1),
(18, '2026-01-27 16:00:14.000000', 'namdh.99@gmail.com', 'Đinh Hoài Nam', b'0', '2026-01-27 16:00:14.000000', '$2a$10$5mN1ZUuyS2Cs1ZXSXFEVyu/eEEc99EwHUbbi0rEa7MJdZVxYzZXkS', 'USER', 1),
(19, '2026-01-27 16:00:14.000000', 'hahn.singer@gmail.com', 'Hồ Ngọc Hà', b'0', '2026-01-27 16:00:14.000000', '$2a$10$CfUlsFAemOcfznZ1DQ8dFeYdYggqxVkQPSBAsnSQuoX61j2JfdrPW', 'USER', 1),
(20, '2026-01-27 16:00:15.000000', 'hailm.8x@gmail.com', 'Lương Mạnh Hải', b'0', '2026-01-27 16:00:15.000000', '$2a$10$M9jWrS8FeJeUEji3uuPzY.xWEDcDrT4AYj5bJX1vqnZgjFyEumyaO', 'USER', 1),
(21, '2026-01-27 16:00:15.000000', 'sauvt.1933@gmail.com', 'Võ Thị Sáu', b'0', '2026-01-27 16:00:15.000000', '$2a$10$ObiC1EwXL/rQddloKsAtb.T6cadTRu9/fcdTCzXmBYin9kyF8CFZq', 'USER', 1),
(22, '2026-01-16 12:31:20.000000', 'minh@gmail.com', 'Tong Minh', b'1', '2026-01-28 12:34:42.000000', '$2a$10$dELPL5yRkP9WlCHalsGqQOY3KLnwTatyQND8xlwJWM4qEz3nd1Z0W', 'USER', 0),
(23, '2026-01-28 12:40:44.000000', 'luyen9984@gmail.com', 'Dao Hong Luyen', b'0', '2026-01-28 12:40:44.000000', '$2a$10$bk5XHCzPia06QNFW67.F/..EFrUddS9EMI8oQUTQTIcFAVwZFfU6m', 'USER', 1),
(24, '2026-01-28 12:43:26.000000', 'minh2@gmail.com', 'Tong Minh', b'1', '2026-01-28 12:48:28.000000', '$2a$10$jrr60hscSyV7bb8JWrhfNOWrxt.3OwEelmn0e3QH6V23UQhzMqe5.', 'USER', 1),
(25, '2026-01-28 16:20:07.000000', 'phat@gmail.com', 'Gia Phát', b'1', '2026-01-28 16:20:07.000000', '$2a$10$hGBte3Wa4aEqXrX/ROVlCeiEiwUyOD3P6HmqNCL2yt4W3KQLNsT7e', 'USER', 1),
(26, '2026-01-29 16:31:24.000000', 'baohm88@hotmail.com', 'Ha Manh Bao', b'1', '2026-01-29 16:31:24.000000', '$2a$10$gIGcMfS/DM6isBh1Q2r9Wen6c5K4GQIUzZQbwktUnZl8z.KZwnNja', 'USER', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_meal_logs`
--

CREATE TABLE `user_meal_logs` (
  `id` bigint(20) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `checked_in` bit(1) DEFAULT NULL,
  `day_number` int(11) DEFAULT NULL,
  `dish_id` bigint(20) DEFAULT NULL,
  `estimated_calories` int(11) DEFAULT NULL,
  `food_name` varchar(255) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `is_plan_compliant` bit(1) DEFAULT NULL,
  `logged_at` datetime(6) DEFAULT NULL,
  `nutrition_details` text DEFAULT NULL,
  `planned_meal_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_meal_logs`
--

INSERT INTO `user_meal_logs` (`id`, `category`, `checked_in`, `day_number`, `dish_id`, `estimated_calories`, `food_name`, `image_url`, `is_plan_compliant`, `logged_at`, `nutrition_details`, `planned_meal_id`, `user_id`) VALUES
(1, 'Sáng', b'0', 1, 2, 400, 'Phở gà', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 1, 22),
(2, 'Trưa', b'0', 1, 27, 250, 'Cá kho tộ', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 2, 22),
(3, 'Tối', b'0', 1, 52, 180, 'Cá lóc hấp bầu', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 3, 22),
(4, 'Phụ', b'0', 1, 80, 150, 'Trái cây tô', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 4, 22),
(5, 'Sáng', b'0', 2, 1, 450, 'Phở bò', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 5, 22),
(6, 'Trưa', b'0', 2, 30, 100, 'Rau muống xào tỏi', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 6, 22),
(7, 'Tối', b'0', 2, 66, 280, 'Gà kho gừng', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 7, 22),
(8, 'Phụ', b'0', 2, 84, 80, 'Thạch rau câu', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 8, 22),
(9, 'Sáng', b'0', 3, 3, 500, 'Bún chả', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 9, 22),
(10, 'Trưa', b'0', 3, 36, 150, 'Trứng chiên', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 10, 22),
(11, 'Tối', b'0', 3, 53, 220, 'Tôm rim mặn ngọt', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 11, 22),
(12, 'Phụ', b'0', 3, 88, 120, 'Khoai lang tím luộc', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 12, 22),
(13, 'Sáng', b'0', 4, 5, 350, 'Bánh mì thịt', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 13, 22),
(14, 'Trưa', b'0', 4, 42, 450, 'Bò kho', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 14, 22),
(15, 'Tối', b'0', 4, 61, 70, 'Canh bí xanh nấu tôm', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 15, 22),
(16, 'Phụ', b'0', 4, 77, 200, 'Chè đỗ đen', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 16, 22),
(17, 'Sáng', b'0', 5, 6, 300, 'Bánh mì trứng', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 17, 22),
(18, 'Trưa', b'0', 5, 29, 300, 'Gà rang sả ớt', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 18, 22),
(19, 'Tối', b'0', 5, 54, 40, 'Đậu bắp luộc', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 19, 22),
(20, 'Phụ', b'0', 5, 81, 50, 'Quả cam', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 20, 22),
(21, 'Sáng', b'0', 6, 7, 450, 'Xôi xéo', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 21, 22),
(22, 'Trưa', b'0', 6, 38, 350, 'Tôm rang thịt ba chỉ', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 22, 22),
(23, 'Tối', b'0', 6, 57, 60, 'Gỏi cuốn', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 23, 22),
(24, 'Phụ', b'0', 6, 86, 120, 'Sữa tươi không đường', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 24, 22),
(25, 'Sáng', b'0', 7, 4, 480, 'Bún bò Huế', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 25, 22),
(26, 'Trưa', b'0', 7, 44, 400, 'Nem rán (Chả giò)', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 26, 22),
(27, 'Tối', b'0', 7, 58, 120, 'Bí đỏ xào tỏi', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 27, 22),
(28, 'Phụ', b'0', 7, 83, 90, 'Quả chuối', NULL, b'1', '2026-01-28 12:33:03.000000', NULL, 28, 22),
(29, 'Sáng', b'1', 1, 2, 400, 'Phở gà', NULL, b'1', '2026-01-28 12:49:05.000000', NULL, 29, 24),
(30, 'Trưa', b'1', 1, 27, 250, 'Cá kho tộ', NULL, b'1', '2026-01-28 12:49:05.000000', NULL, 30, 24),
(31, 'Tối', b'1', 1, 43, 250, 'Gà luộc', NULL, b'1', '2026-01-28 12:49:05.000000', NULL, 31, 24),
(32, 'Phụ', b'1', 1, 80, 150, 'Trái cây tô', NULL, b'1', '2026-01-28 12:49:05.000000', NULL, 32, 24),
(33, 'Sáng', b'1', 2, 1, 450, 'Phở Bò', '', b'1', '2026-01-28 12:49:05.000000', 'Protein: 30g (từ bò và nước dùng), Carb: 60g (từ bánh phở và rau thơm), Fat: 10g (từ dầu mỡ và bò), Vitamin: Vitamin B12, sắt, kẽm', 33, 24),
(34, 'Trưa', b'1', 2, 101, 450, 'Cơm gà', '', b'1', '2026-01-28 12:49:05.000000', 'Cơm gà thường bao gồm gạo, thịt gà, và các loại rau gia vị. Ước lượng dinh dưỡng: protein 35g (từ gà), carb 60g (từ gạo), fat 10g (từ gà và dầu ăn), vitamin A, C, và một số khoáng chất như kali, phốt pho.', 34, 24),
(35, 'Tối', b'0', 2, 53, 220, 'Tôm rim mặn ngọt', NULL, b'1', '2026-01-28 12:49:05.000000', NULL, 35, 24),
(36, 'Phụ', b'0', 2, 84, 80, 'Thạch rau câu', NULL, b'1', '2026-01-28 12:49:05.000000', NULL, 36, 24),
(37, 'Sáng', b'0', 3, 3, 500, 'Bún chả', NULL, b'1', '2026-01-28 12:49:05.000000', NULL, 37, 24),
(38, 'Trưa', b'0', 3, 66, 280, 'Gà kho gừng', NULL, b'1', '2026-01-28 12:49:05.000000', NULL, 38, 24),
(39, 'Tối', b'0', 3, 54, 40, 'Đậu bắp luộc', NULL, b'1', '2026-01-28 12:49:05.000000', NULL, 39, 24),
(40, 'Phụ', b'0', 3, 88, 120, 'Khoai lang tím luộc', NULL, b'1', '2026-01-28 12:49:05.000000', NULL, 40, 24),
(41, 'Sáng', b'0', 4, 4, 480, 'Bún bò Huế', NULL, b'1', '2026-01-28 12:49:05.000000', NULL, 41, 24),
(42, 'Trưa', b'0', 4, 29, 300, 'Gà rang sả ớt', NULL, b'1', '2026-01-28 12:49:05.000000', NULL, 42, 24),
(43, 'Tối', b'0', 4, 64, 120, 'Đậu phụ luộc', NULL, b'1', '2026-01-28 12:49:05.000000', NULL, 43, 24),
(44, 'Phụ', b'0', 4, 81, 50, 'Quả cam', NULL, b'1', '2026-01-28 12:49:05.000000', NULL, 44, 24),
(45, 'Sáng', b'0', 5, 5, 350, 'Bánh mì thịt', NULL, b'1', '2026-01-28 12:49:05.000000', NULL, 45, 24),
(46, 'Trưa', b'0', 5, 38, 350, 'Tôm rang thịt ba chỉ', NULL, b'1', '2026-01-28 12:49:05.000000', NULL, 46, 24),
(47, 'Tối', b'0', 5, 63, 70, 'Trứng luộc', NULL, b'1', '2026-01-28 12:49:05.000000', NULL, 47, 24),
(48, 'Phụ', b'0', 5, 76, 250, 'Chè bưởi', NULL, b'1', '2026-01-28 12:49:05.000000', NULL, 48, 24),
(49, 'Sáng', b'0', 6, 6, 300, 'Bánh mì trứng', NULL, b'1', '2026-01-28 12:49:05.000000', NULL, 49, 24),
(50, 'Trưa', b'0', 6, 42, 450, 'Bò kho', NULL, b'1', '2026-01-28 12:49:05.000000', NULL, 50, 24),
(51, 'Tối', b'0', 6, 62, 90, 'Bắp cải xào', NULL, b'1', '2026-01-28 12:49:05.000000', NULL, 51, 24),
(52, 'Phụ', b'0', 6, 77, 200, 'Chè đỗ đen', NULL, b'1', '2026-01-28 12:49:05.000000', NULL, 52, 24),
(53, 'Sáng', b'0', 7, 7, 450, 'Xôi xéo', NULL, b'1', '2026-01-28 12:49:05.000000', NULL, 53, 24),
(54, 'Trưa', b'0', 7, 41, 300, 'Chả lá lốt', NULL, b'1', '2026-01-28 12:49:05.000000', NULL, 54, 24),
(55, 'Tối', b'0', 7, 61, 70, 'Canh bí xanh nấu tôm', NULL, b'1', '2026-01-28 12:49:05.000000', NULL, 55, 24),
(56, 'Phụ', b'0', 7, 79, 200, 'Sữa chua nếp cẩm', NULL, b'1', '2026-01-28 12:49:05.000000', NULL, 56, 24),
(57, 'Sáng', b'0', 1, 2, 400, 'Phở gà', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 57, 24),
(58, 'Trưa', b'0', 1, 27, 250, 'Cá kho tộ', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 58, 24),
(59, 'Tối', b'0', 1, 43, 250, 'Gà luộc', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 59, 24),
(60, 'Phụ', b'0', 1, 80, 150, 'Trái cây tô', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 60, 24),
(61, 'Sáng', b'0', 2, 1, 450, 'Phở bò', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 61, 24),
(62, 'Trưa', b'0', 2, 30, 100, 'Rau muống xào tỏi', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 62, 24),
(63, 'Tối', b'0', 2, 53, 220, 'Tôm rim mặn ngọt', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 63, 24),
(64, 'Phụ', b'0', 2, 84, 80, 'Thạch rau câu', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 64, 24),
(65, 'Sáng', b'0', 3, 3, 500, 'Bún chả', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 65, 24),
(66, 'Trưa', b'0', 3, 66, 280, 'Gà kho gừng', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 66, 24),
(67, 'Tối', b'0', 3, 54, 40, 'Đậu bắp luộc', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 67, 24),
(68, 'Phụ', b'0', 3, 88, 120, 'Khoai lang tím luộc', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 68, 24),
(69, 'Sáng', b'0', 4, 4, 480, 'Bún bò Huế', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 69, 24),
(70, 'Trưa', b'0', 4, 28, 350, 'Thịt kho tàu', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 70, 24),
(71, 'Tối', b'0', 4, 44, 400, 'Nem rán (Chả giò)', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 71, 24),
(72, 'Phụ', b'0', 4, 81, 50, 'Quả cam', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 72, 24),
(73, 'Sáng', b'0', 5, 5, 350, 'Bánh mì thịt', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 73, 24),
(74, 'Trưa', b'0', 5, 29, 300, 'Gà rang sả ớt', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 74, 24),
(75, 'Tối', b'0', 5, 55, 50, 'Canh đại dương', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 75, 24),
(76, 'Phụ', b'0', 5, 85, 160, 'Bánh flan', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 76, 24),
(77, 'Sáng', b'0', 6, 6, 300, 'Bánh mì trứng', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 77, 24),
(78, 'Trưa', b'0', 6, 31, 200, 'Đậu phụ sốt cà chua', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 78, 24),
(79, 'Tối', b'0', 6, 45, 100, 'Canh rau ngót nấu thịt băm', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 79, 24),
(80, 'Phụ', b'0', 6, 82, 60, 'Quả táo', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 80, 24),
(81, 'Sáng', b'0', 7, 7, 450, 'Xôi xéo', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 81, 24),
(82, 'Trưa', b'0', 7, 32, 150, 'Canh chua cá lóc', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 82, 24),
(83, 'Tối', b'0', 7, 46, 200, 'Giá đỗ xào lòng gà', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 83, 24),
(84, 'Phụ', b'0', 7, 83, 90, 'Quả chuối', NULL, b'1', '2026-01-28 16:02:30.000000', NULL, 84, 24),
(113, 'Sáng', b'0', 1, 2, 400, 'Phở gà', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 113, 25),
(114, 'Trưa', b'0', 1, 27, 250, 'Cá kho tộ', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 114, 25),
(115, 'Tối', b'0', 1, 52, 180, 'Cá lóc hấp bầu', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 115, 25),
(116, 'Phụ', b'0', 1, 80, 150, 'Trái cây tô', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 116, 25),
(117, 'Sáng', b'0', 2, 12, 300, 'Cháo gà', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 117, 25),
(118, 'Trưa', b'0', 2, 30, 100, 'Rau muống xào tỏi', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 118, 25),
(119, 'Tối', b'0', 2, 66, 280, 'Gà kho gừng', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 119, 25),
(120, 'Phụ', b'0', 2, 81, 50, 'Quả cam', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 120, 25),
(121, 'Sáng', b'0', 3, 5, 350, 'Bánh mì thịt', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 121, 25),
(122, 'Trưa', b'0', 3, 36, 150, 'Trứng chiên', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 122, 25),
(123, 'Tối', b'0', 3, 53, 220, 'Tôm rim mặn ngọt', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 123, 25),
(124, 'Phụ', b'0', 3, 88, 120, 'Khoai lang tím luộc', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 124, 25),
(125, 'Sáng', b'0', 4, 6, 300, 'Bánh mì trứng', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 125, 25),
(126, 'Trưa', b'0', 4, 26, 130, 'Cơm trắng', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 126, 25),
(127, 'Tối', b'0', 4, 41, 300, 'Chả lá lốt', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 127, 25),
(128, 'Phụ', b'0', 4, 84, 80, 'Thạch rau câu', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 128, 25),
(129, 'Sáng', b'0', 5, 9, 350, 'Bánh cuốn', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 129, 25),
(130, 'Trưa', b'0', 5, 34, 250, 'Bò xào thiên lý', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 130, 25),
(131, 'Tối', b'0', 5, 54, 40, 'Đậu bắp luộc', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 131, 25),
(132, 'Phụ', b'0', 5, 86, 120, 'Sữa tươi không đường', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 132, 25),
(133, 'Sáng', b'0', 6, 10, 300, 'Bánh giò', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 133, 25),
(134, 'Trưa', b'0', 6, 29, 300, 'Gà rang sả ớt', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 134, 25),
(135, 'Tối', b'0', 6, 57, 60, 'Gỏi cuốn', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 135, 25),
(136, 'Phụ', b'0', 6, 83, 90, 'Quả chuối', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 136, 25),
(137, 'Sáng', b'0', 7, 1, 450, 'Phở bò', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 137, 25),
(138, 'Trưa', b'0', 7, 25, 550, 'Bún đậu mắm tôm', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 138, 25),
(139, 'Tối', b'0', 7, 50, 600, 'Cơm rang dưa bò', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 139, 25),
(140, 'Phụ', b'0', 7, 82, 60, 'Quả táo', NULL, b'1', '2026-01-28 16:34:23.000000', NULL, 140, 25),
(141, 'Sáng', b'0', 1, 2, 400, 'Phở gà', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 141, 26),
(142, 'Trưa', b'0', 1, 27, 250, 'Cá kho tộ', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 142, 26),
(143, 'Tối', b'0', 1, 43, 250, 'Gà luộc', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 143, 26),
(144, 'Phụ', b'0', 1, 80, 150, 'Trái cây tô', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 144, 26),
(145, 'Sáng', b'0', 2, 1, 450, 'Phở bò', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 145, 26),
(146, 'Trưa', b'0', 2, 30, 100, 'Rau muống xào tỏi', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 146, 26),
(147, 'Tối', b'0', 2, 66, 280, 'Gà kho gừng', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 147, 26),
(148, 'Phụ', b'0', 2, 84, 80, 'Thạch rau câu', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 148, 26),
(149, 'Sáng', b'0', 3, 6, 300, 'Bánh mì trứng', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 149, 26),
(150, 'Trưa', b'0', 3, 35, 200, 'Mực xào cần tỏi', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 150, 26),
(151, 'Tối', b'0', 3, 53, 220, 'Tôm rim mặn ngọt', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 151, 26),
(152, 'Phụ', b'0', 3, 88, 120, 'Khoai lang tím luộc', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 152, 26),
(153, 'Sáng', b'0', 4, 5, 350, 'Bánh mì thịt', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 153, 26),
(154, 'Trưa', b'0', 4, 41, 300, 'Chả lá lốt', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 154, 26),
(155, 'Tối', b'0', 4, 60, 230, 'Cá hường chiên', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 155, 26),
(156, 'Phụ', b'0', 4, 81, 50, 'Quả cam', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 156, 26),
(157, 'Sáng', b'0', 5, 3, 500, 'Bún chả', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 157, 26),
(158, 'Trưa', b'0', 5, 46, 200, 'Giá đỗ xào lòng gà', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 158, 26),
(159, 'Tối', b'0', 5, 54, 40, 'Đậu bắp luộc', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 159, 26),
(160, 'Phụ', b'0', 5, 86, 120, 'Sữa tươi không đường', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 160, 26),
(161, 'Sáng', b'0', 6, 4, 480, 'Bún bò Huế', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 161, 26),
(162, 'Trưa', b'0', 6, 38, 350, 'Tôm rang thịt ba chỉ', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 162, 26),
(163, 'Tối', b'0', 6, 62, 90, 'Bắp cải xào', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 163, 26),
(164, 'Phụ', b'0', 6, 89, 150, 'Ngô luộc', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 164, 26),
(165, 'Sáng', b'0', 7, 7, 450, 'Xôi xéo', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 165, 26),
(166, 'Trưa', b'0', 7, 32, 150, 'Canh chua cá lóc', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 166, 26),
(167, 'Tối', b'0', 7, 59, 250, 'Thịt bò trộn dầu giấm', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 167, 26),
(168, 'Phụ', b'0', 7, 85, 160, 'Bánh flan', NULL, b'1', '2026-01-29 16:33:26.000000', NULL, 168, 26);

-- --------------------------------------------------------

--
-- Table structure for table `verify_otp`
--

CREATE TABLE `verify_otp` (
  `id` bigint(20) NOT NULL,
  `created_date` datetime(6) NOT NULL,
  `email` varchar(150) NOT NULL,
  `otp` varchar(6) NOT NULL,
  `usage_date` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `verify_otp`
--

INSERT INTO `verify_otp` (`id`, `created_date`, `email`, `otp`, `usage_date`) VALUES
(1, '2026-01-29 16:31:24.000000', 'baohm88@hotmail.com', '218410', 1769704314);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dish_library`
--
ALTER TABLE `dish_library`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `health_analysis`
--
ALTER TABLE `health_analysis`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `health_profiles`
--
ALTER TABLE `health_profiles`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `meal_plans`
--
ALTER TABLE `meal_plans`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKn6ydqsk2mkkshdpjkmx23m7y7` (`user_id`);

--
-- Indexes for table `planned_meals`
--
ALTER TABLE `planned_meals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKfis5in5p4f2sccgtdkhx5kynn` (`dish_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`);

--
-- Indexes for table `user_meal_logs`
--
ALTER TABLE `user_meal_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `verify_otp`
--
ALTER TABLE `verify_otp`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dish_library`
--
ALTER TABLE `dish_library`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT for table `health_analysis`
--
ALTER TABLE `health_analysis`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `meal_plans`
--
ALTER TABLE `meal_plans`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `planned_meals`
--
ALTER TABLE `planned_meals`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=169;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `user_meal_logs`
--
ALTER TABLE `user_meal_logs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=169;

--
-- AUTO_INCREMENT for table `verify_otp`
--
ALTER TABLE `verify_otp`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `planned_meals`
--
ALTER TABLE `planned_meals`
  ADD CONSTRAINT `FKfis5in5p4f2sccgtdkhx5kynn` FOREIGN KEY (`dish_id`) REFERENCES `dish_library` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
