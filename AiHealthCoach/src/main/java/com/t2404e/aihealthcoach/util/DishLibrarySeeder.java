package com.t2404e.aihealthcoach.util;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.t2404e.aihealthcoach.entity.DishLibrary;
import com.t2404e.aihealthcoach.enums.MealTimeSlot;
import com.t2404e.aihealthcoach.repository.DishLibraryRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DishLibrarySeeder implements CommandLineRunner {

        private final DishLibraryRepository repository;

        @Override
        public void run(String... args) {
                if (repository.count() > 0) {
                        System.out.println("ℹ️ DishLibrary already seeded.");
                        return;
                }

                List<DishLibrary> dishes = new ArrayList<>();

                // BREAKFAST (25 món)
                addDish(dishes, "Phở bò", 450, "bát", MealTimeSlot.BREAKFAST,
                                "Phở bò tái chín với nước dùng ninh xương đậm đà");
                addDish(dishes, "Phở gà", 400, "bát", MealTimeSlot.BREAKFAST,
                                "Phở gà ta thịt dai ngọt, nước dùng thanh nhẹ");
                addDish(dishes, "Bún chả", 500, "suất", MealTimeSlot.BREAKFAST,
                                "Bún chả Hà Nội nướng than hoa thơm lừng");
                addDish(dishes, "Bún bò Huế", 480, "bát", MealTimeSlot.BREAKFAST,
                                "Bún bò Huế cay nồng, chân giò heo và chả cua");
                addDish(dishes, "Bánh mì thịt", 350, "cái", MealTimeSlot.BREAKFAST,
                                "Bánh mì kẹp thịt nướng, pate và rau sống");
                addDish(dishes, "Bánh mì trứng", 300, "cái", MealTimeSlot.BREAKFAST,
                                "Bánh mì ốp la đơn giản, giàu năng lượng");
                addDish(dishes, "Xôi xéo", 450, "gói", MealTimeSlot.BREAKFAST,
                                "Xôi xéo đậu xanh hành phi mỡ gà béo ngậy");
                addDish(dishes, "Xôi gà", 500, "gói", MealTimeSlot.BREAKFAST, "Xôi nếp dẻo ăn kèm thịt gà xé phay");
                addDish(dishes, "Bánh cuốn", 350, "đĩa", MealTimeSlot.BREAKFAST,
                                "Bánh cuốn nhân thịt mộc nhĩ chấm nước mắm");
                addDish(dishes, "Bánh giò", 300, "cái", MealTimeSlot.BREAKFAST,
                                "Bánh giò nóng hổi nhân thịt băm mộc nhĩ");
                addDish(dishes, "Cháo lòng", 350, "bát", MealTimeSlot.BREAKFAST, "Cháo lòng heo đầy đủ dinh dưỡng");
                addDish(dishes, "Cháo gà", 300, "bát", MealTimeSlot.BREAKFAST, "Cháo gà hạt sen bổ dưỡng, dễ tiêu hóa");
                addDish(dishes, "Mì tôm trứng", 350, "bát", MealTimeSlot.BREAKFAST, "Mì gói nấu trứng chần nhanh gọn");
                addDish(dishes, "Bún riêu cua", 400, "bát", MealTimeSlot.BREAKFAST,
                                "Bún riêu cua đồng vị chua thanh mát");
                addDish(dishes, "Bún mọc", 380, "bát", MealTimeSlot.BREAKFAST,
                                "Bún mọc viên giòn dai, nước dùng ngọt thanh");
                addDish(dishes, "Bánh mì chảo", 550, "suất", MealTimeSlot.BREAKFAST,
                                "Bánh mì chảo thập cẩm xúc xích pate");
                addDish(dishes, "Bánh bao nhân thịt", 350, "cái", MealTimeSlot.BREAKFAST,
                                "Bánh bao nhân thịt trứng cút nóng hổi");
                addDish(dishes, "Miến gà", 350, "bát", MealTimeSlot.BREAKFAST, "Miến măng gà nước dùng trong veo");
                addDish(dishes, "Bún thang", 400, "bát", MealTimeSlot.BREAKFAST,
                                "Bún thang Hà Nội tinh tế, nhiều topping");
                addDish(dishes, "Bánh mì ốp la", 320, "cái", MealTimeSlot.BREAKFAST,
                                "Bánh mì kẹp trứng ốp la lòng đào");
                addDish(dishes, "Súp cua", 250, "bát", MealTimeSlot.BREAKFAST, "Súp cua đặc sánh, thơm ngon bổ dưỡng");
                addDish(dishes, "Bánh xèo", 450, "cái", MealTimeSlot.BREAKFAST,
                                "Bánh xèo miền Tây giòn rụm nhân tôm thịt");
                addDish(dishes, "Bánh khọt", 350, "đĩa (5 cái)", MealTimeSlot.BREAKFAST,
                                "Bánh khọt cốt dừa béo ngậy nhân tôm");
                addDish(dishes, "Hủ tiếu Nam Vang", 450, "bát", MealTimeSlot.BREAKFAST,
                                "Hủ tiếu Nam Vang đậm đà hương vị miền Nam");
                addDish(dishes, "Bún đậu mắm tôm", 550, "mẹt", MealTimeSlot.BREAKFAST,
                                "Bún đậu mắm tôm full topping dồi sụn");

                // LUNCH (25 món)
                addDish(dishes, "Cơm trắng", 130, "bát (100g)", MealTimeSlot.LUNCH, "Cơm trắng dẻo thơm từ gạo ngon");
                addDish(dishes, "Cá kho tộ", 250, "tô nhỏ", MealTimeSlot.LUNCH, "Cá lóc kho tộ đậm đà đưa cơm");
                addDish(dishes, "Thịt kho tàu", 350, "tô nhỏ", MealTimeSlot.LUNCH,
                                "Thịt kho trứng vịt nước dừa mềm ngon");
                addDish(dishes, "Gà rang sả ớt", 300, "đĩa nhỏ", MealTimeSlot.LUNCH,
                                "Gà rang sả ớt cay nồng kích thích vị giác");
                addDish(dishes, "Rau muống xào tỏi", 100, "đĩa", MealTimeSlot.LUNCH,
                                "Rau muống xào tỏi xanh mướt giòn ngon");
                addDish(dishes, "Đậu phụ sốt cà chua", 200, "đĩa", MealTimeSlot.LUNCH,
                                "Đậu phụ chiên sốt cà chua đơn giản mà ngon");
                addDish(dishes, "Canh chua cá lóc", 150, "bát tô", MealTimeSlot.LUNCH,
                                "Canh chua cá lóc giải nhiệt ngày hè");
                addDish(dishes, "Sườn xào chua ngọt", 350, "đĩa", MealTimeSlot.LUNCH, "Sườn non xào chua ngọt đậm đà");
                addDish(dishes, "Bò xào thiên lý", 250, "đĩa", MealTimeSlot.LUNCH, "Thịt bò xào hoa thiên lý thơm mát");
                addDish(dishes, "Mực xào cần tỏi", 200, "đĩa", MealTimeSlot.LUNCH,
                                "Mực tươi xào cần tỏi tây giòn ngọt");
                addDish(dishes, "Trứng chiên", 150, "cái", MealTimeSlot.LUNCH, "Trứng gà chiên hành tây thơm lừng");
                addDish(dishes, "Cá diêu hồng chiên xù", 300, "con nhỏ", MealTimeSlot.LUNCH,
                                "Cá diêu hồng chiên giòn chấm nước mắm tỏi ớt");
                addDish(dishes, "Tôm rang thịt ba chỉ", 350, "đĩa", MealTimeSlot.LUNCH,
                                "Tôm rang thịt cháy cạnh đậm đà");
                addDish(dishes, "Canh mồng tơi nấu tôm", 80, "bát tô", MealTimeSlot.LUNCH,
                                "Canh rau mồng tơi nấu tôm khô ngọt mát");
                addDish(dishes, "Rau lang luộc", 50, "đĩa", MealTimeSlot.LUNCH, "Rau lang luộc chấm nước mắm tỏi");
                addDish(dishes, "Chả lá lốt", 300, "đĩa (5-6 cái)", MealTimeSlot.LUNCH,
                                "Chả thịt cuốn lá lốt chiên thơm nức");
                addDish(dishes, "Bò kho", 450, "bát", MealTimeSlot.LUNCH,
                                "Bò kho ngũ vị hương ăn kèm bánh mì hoặc cơm");
                addDish(dishes, "Gà luộc", 250, "đĩa nhỏ", MealTimeSlot.LUNCH, "Thịt gà ta luộc lá chanh da giòn");
                addDish(dishes, "Nem rán (Chả giò)", 400, "đĩa (4-5 cái)", MealTimeSlot.LUNCH,
                                "Nem rán nhân thịt thập cẩm giòn rụm");
                addDish(dishes, "Canh rau ngót nấu thịt băm", 100, "bát tô", MealTimeSlot.LUNCH,
                                "Canh rau ngót thịt nạc bổ dưỡng");
                addDish(dishes, "Giá đỗ xào lòng gà", 200, "đĩa", MealTimeSlot.LUNCH,
                                "Giá đỗ xào lòng mề gà giòn sần sật");
                addDish(dishes, "Măng kho thịt", 300, "đĩa", MealTimeSlot.LUNCH, "Thịt ba chỉ kho măng tươi đậm đà");
                addDish(dishes, "Cá thu sốt cà chua", 280, "lát", MealTimeSlot.LUNCH,
                                "Cá thu chiên sốt cà chua giàu Omega 3");
                addDish(dishes, "Khổ qua xào trứng", 150, "đĩa", MealTimeSlot.LUNCH,
                                "Mướp đắng xào trứng vị nhẫn đắng tốt cho sức khỏe");
                addDish(dishes, "Cơm rang dưa bò", 600, "đĩa", MealTimeSlot.LUNCH, "Cơm rang dưa chua thịt bò đậm vị");

                // DINNER (25 món)
                addDish(dishes, "Cơm niêu", 200, "niêu nhỏ", MealTimeSlot.DINNER, "Cơm niêu nấu nồi đất hạt dẻo thơm");
                addDish(dishes, "Cá lóc hấp bầu", 180, "đĩa", MealTimeSlot.DINNER,
                                "Cá lóc hấp bầu ngọt thanh tự nhiên");
                addDish(dishes, "Tôm rim mặn ngọt", 220, "đĩa", MealTimeSlot.DINNER, "Tôm đồng rim mặn ngọt đưa cơm");
                addDish(dishes, "Đậu bắp luộc", 40, "đĩa", MealTimeSlot.DINNER, "Đậu bắp luộc chấm chao");
                addDish(dishes, "Canh đại dương", 50, "bát", MealTimeSlot.DINNER, "Canh rong biển nấu đậu hũ non");
                addDish(dishes, "Nộm đu đủ gà xé", 150, "đĩa", MealTimeSlot.DINNER,
                                "Nộm đu đủ tai heo tôm thịt chua ngọt");
                addDish(dishes, "Gỏi cuốn", 60, "cái", MealTimeSlot.DINNER, "Gỏi cuốn tôm thịt thanh mát ít calo");
                addDish(dishes, "Bí đỏ xào tỏi", 120, "đĩa", MealTimeSlot.DINNER, "Bí đỏ xào tỏi giàu vitamin A");
                addDish(dishes, "Thịt bò trộn dầu giấm", 250, "đĩa", MealTimeSlot.DINNER,
                                "Salad thịt bò trộn dầu giấm chua ngọt");
                addDish(dishes, "Cá hường chiên", 230, "con", MealTimeSlot.DINNER, "Cá hường chiên sả ớt giòn tan");
                addDish(dishes, "Canh bí xanh nấu tôm", 70, "bát tô", MealTimeSlot.DINNER,
                                "Canh bí đao nấu tôm nõn thanh nhiệt");
                addDish(dishes, "Bắp cải xào", 90, "đĩa", MealTimeSlot.DINNER, "Bắp cải xào cà chua đơn giản");
                addDish(dishes, "Trứng luộc", 70, "quả", MealTimeSlot.DINNER, "Trứng gà luộc lòng đào bổ dưỡng");
                addDish(dishes, "Đậu phụ luộc", 120, "bìa", MealTimeSlot.DINNER, "Đậu phụ luộc thanh đạm chấm mắm tôm");
                addDish(dishes, "Canh cua mồng tơi", 110, "bát tô", MealTimeSlot.DINNER,
                                "Canh cua rau đay mồng tơi mướp hương");
                addDish(dishes, "Gà kho gừng", 280, "đĩa", MealTimeSlot.DINNER, "Gà kho gừng ấm bụng ngày mưa");
                addDish(dishes, "Ba chỉ luộc", 300, "đĩa", MealTimeSlot.DINNER, "Thịt ba chỉ luộc chấm mắm tép");
                addDish(dishes, "Rau củ quả luộc chấm kho quẹt", 250, "đĩa", MealTimeSlot.DINNER,
                                "Rau củ luộc chấm kho quẹt tôm khô");
                addDish(dishes, "Cá cơm kho tiêu", 180, "đĩa nhỏ", MealTimeSlot.DINNER,
                                "Cá cơm kho tiêu cay nồng ăn với cháo trắng");
                addDish(dishes, "Canh khổ qua nhồi thịt", 200, "bát", MealTimeSlot.DINNER,
                                "Canh mướp đắng nhồi thịt thanh lọc cơ thể");
                addDish(dishes, "Mướp xào lòng mề", 180, "đĩa", MealTimeSlot.DINNER,
                                "Mướp hương xào lòng gà thơm ngọt");
                addDish(dishes, "Thịt bò xào bông cải", 220, "đĩa", MealTimeSlot.DINNER,
                                "Thịt bò xào súp lơ xanh giàu sắt");
                addDish(dishes, "Đậu hũ chiên sả ớt", 250, "đĩa", MealTimeSlot.DINNER,
                                "Đậu hũ chiên tẩm sả ớt giòn cay");
                addDish(dishes, "Canh cải xanh nấu cá", 130, "bát tô", MealTimeSlot.DINNER,
                                "Canh cải bẹ xanh nấu cá rô đồng");
                addDish(dishes, "Súp ngô gà", 180, "bát", MealTimeSlot.DINNER, "Súp ngô ngọt thịt gà xé phay");

                // SNACK (25 món)
                addDish(dishes, "Chè bưởi", 250, "bát", MealTimeSlot.SNACK, "Chè bưởi cốt dừa đậu xanh giòn sật");
                addDish(dishes, "Chè đỗ đen", 200, "bát", MealTimeSlot.SNACK, "Chè đỗ đen đá mát lạnh");
                addDish(dishes, "Chè dưỡng nhan", 150, "bát", MealTimeSlot.SNACK, "Chè dưỡng nhan tuyết yến nhựa đào");
                addDish(dishes, "Sữa chua nếp cẩm", 200, "hũ", MealTimeSlot.SNACK, "Sữa chua nếp cẩm tốt cho tiêu hóa");
                addDish(dishes, "Trái cây tô", 150, "bát", MealTimeSlot.SNACK, "Trái cây tô trộn sữa chua");
                addDish(dishes, "Quả cam", 50, "quả", MealTimeSlot.SNACK, "Cam tươi mọng nước giàu Vitamin C");
                addDish(dishes, "Quả táo", 60, "quả", MealTimeSlot.SNACK, "Táo Mỹ giòn ngọt giàu chất xơ");
                addDish(dishes, "Quả chuối", 90, "quả", MealTimeSlot.SNACK, "Chuối tiêu chín cung cấp kali");
                addDish(dishes, "Thạch rau câu", 80, "đĩa", MealTimeSlot.SNACK, "Thạch rau câu dừa thanh mát");
                addDish(dishes, "Bánh flan", 160, "cái", MealTimeSlot.SNACK, "Bánh flan trứng sữa caramel mềm mịn");
                addDish(dishes, "Sữa tươi không đường", 120, "hộp 180ml", MealTimeSlot.SNACK,
                                "Sữa tươi tiệt trùng không đường");
                addDish(dishes, "Các loại hạt", 160, "nắm nhỏ (30g)", MealTimeSlot.SNACK,
                                "Hạt điều, hạnh nhân, óc chó sấy khô");
                addDish(dishes, "Khoai lang tím luộc", 120, "củ vừa", MealTimeSlot.SNACK,
                                "Khoai lang tím luộc giảm cân");
                addDish(dishes, "Ngô luộc", 150, "bắp", MealTimeSlot.SNACK, "Ngô nếp luộc dẻo thơm");
                addDish(dishes, "Bánh giò (phụ)", 300, "cái", MealTimeSlot.SNACK, "Bữa phụ với bánh giò nóng");
                addDish(dishes, "Nước ép cần tây", 40, "cốc", MealTimeSlot.SNACK, "Nước ép cần tây thanh lọc detox");
                addDish(dishes, "Sinh tố bơ", 250, "cốc", MealTimeSlot.SNACK, "Sinh tố bơ cốt dừa béo ngậy");
                addDish(dishes, "Nước dừa", 60, "trái", MealTimeSlot.SNACK, "Nước dừa xiêm tươi mát lành");
                addDish(dishes, "Bánh bò", 120, "cái", MealTimeSlot.SNACK, "Bánh bò thốt nốt rễ tre mềm xốp");
                addDish(dishes, "Bánh da lợn", 150, "miếng", MealTimeSlot.SNACK,
                                "Bánh da lợn đậu xanh lá dứa dẻo thơm");
                addDish(dishes, "Trứng vịt lộn", 180, "quả", MealTimeSlot.SNACK, "Trứng vịt lộn hầm ngải cứu");
                addDish(dishes, "Nem chua", 40, "cái nhỏ", MealTimeSlot.SNACK, "Nem chua Thanh Hóa tỏi ớt");
                addDish(dishes, "Cá viên chiên", 250, "xiên (5 cái)", MealTimeSlot.SNACK, "Cá viên chiên nước mắm");
                addDish(dishes, "Bánh tráng trộn", 350, "suất", MealTimeSlot.SNACK, "Bánh tráng trộn bò khô xoài xanh");
                addDish(dishes, "Trà sữa", 350, "cốc", MealTimeSlot.SNACK,
                                "Trà sữa trân châu đường đen (hạn chế uống)");

                // NEW BREAKFAST (50 món mới)
                addDish(dishes, "Mì Quảng", 450, "bát", MealTimeSlot.BREAKFAST, "Mì Quảng tôm thịt truyền thống");
                addDish(dishes, "Bún cá", 380, "bát", MealTimeSlot.BREAKFAST, "Bún cá Hải Phòng giòn rụm");
                addDish(dishes, "Bánh đa cua", 420, "bát", MealTimeSlot.BREAKFAST, "Bánh đa cua Hải Phòng đặc sản");
                addDish(dishes, "Miến lươn", 350, "bát", MealTimeSlot.BREAKFAST, "Miến lươn khô giòn tan");
                addDish(dishes, "Súp tôm", 220, "bát", MealTimeSlot.BREAKFAST, "Súp tôm ngô ngọt nhẹ nhàng");
                addDish(dishes, "Bánh mì bơ tỏi", 300, "cái", MealTimeSlot.BREAKFAST, "Bánh mì nướng bơ tỏi thơm lừng");
                addDish(dishes, "Xôi lạc", 400, "gói", MealTimeSlot.BREAKFAST, "Xôi nếp lạc bùi ngậy");
                addDish(dishes, "Cháo bò", 320, "bát", MealTimeSlot.BREAKFAST, "Cháo thịt bò băm nhuyễn");
                addDish(dishes, "Bún sứa", 350, "bát", MealTimeSlot.BREAKFAST, "Bún sứa Nha Trang lạ miệng");
                addDish(dishes, "Hủ tiếu mì", 480, "bát", MealTimeSlot.BREAKFAST, "Hủ tiếu mì xương heo đậm đà");
                addDish(dishes, "Xôi vò", 350, "gói", MealTimeSlot.BREAKFAST, "Xôi vò đậu xanh tơi dẻo");
                addDish(dishes, "Cháo cá lóc", 300, "bát", MealTimeSlot.BREAKFAST, "Cháo cá lóc rau đắng miền Tây");
                addDish(dishes, "Bánh hỏi thịt nướng", 450, "đĩa", MealTimeSlot.BREAKFAST,
                                "Bánh hỏi Bình Định ăn kèm thịt nướng");
                addDish(dishes, "Mì xào bò", 550, "đĩa", MealTimeSlot.BREAKFAST, "Mì tôm xào thịt bò và cải xanh");
                addDish(dishes, "Nui nấu xương", 400, "bát", MealTimeSlot.BREAKFAST, "Nui ống nấu sườn heo ngọt nước");
                addDish(dishes, "Bánh canh cua", 500, "bát", MealTimeSlot.BREAKFAST, "Bánh canh cua đặc sánh");
                addDish(dishes, "Bún cá cay", 400, "bát", MealTimeSlot.BREAKFAST, "Bún cá cay đặc sản miền Biển");
                addDish(dishes, "Bánh mì đặc ruột", 250, "ổ", MealTimeSlot.BREAKFAST, "Bánh mì đặc ruột nóng hổi");
                addDish(dishes, "Cháo thịt băm", 280, "bát", MealTimeSlot.BREAKFAST, "Cháo trắng thịt băm đơn giản");
                addDish(dishes, "Xôi đậu xanh", 380, "gói", MealTimeSlot.BREAKFAST, "Xôi nếp đậu xanh hạt sen");
                addDish(dishes, "Bánh giầy giò", 350, "cái", MealTimeSlot.BREAKFAST, "Bánh giầy kẹp giò lụa thơm ngon");
                addDish(dishes, "Mì hoành thánh", 450, "bát", MealTimeSlot.BREAKFAST, "Mì hoành thánh xá xíu");
                addDish(dishes, "Bún măng vịt", 550, "bát", MealTimeSlot.BREAKFAST, "Bún măng vịt chấm mắm gừng");
                addDish(dishes, "Xôi khúc", 450, "cái", MealTimeSlot.BREAKFAST, "Xôi khúc nhân đậu xanh thịt mỡ");
                addDish(dishes, "Bánh mì kẹp xúc xích", 380, "cái", MealTimeSlot.BREAKFAST, "Bánh mì hotdog kiểu Việt");
                addDish(dishes, "Cháo ếch", 420, "bát", MealTimeSlot.BREAKFAST, "Cháo trắng ăn kèm ếch kho Singapore");
                addDish(dishes, "Bánh bèo", 300, "đĩa (6 cái)", MealTimeSlot.BREAKFAST,
                                "Bánh bèo nhân tôm cháy miền Trung");
                addDish(dishes, "Bánh bột lọc", 350, "đĩa", MealTimeSlot.BREAKFAST,
                                "Bánh bột lọc nhân tôm thịt dai giòn");
                addDish(dishes, "Bún mắm", 600, "bát", MealTimeSlot.BREAKFAST, "Bún mắm miền Tây đậm đà hương vị");
                addDish(dishes, "Xôi mặn", 550, "hộp", MealTimeSlot.BREAKFAST, "Xôi thập cẩm lạp xưởng chà bông");
                addDish(dishes, "Bún nhâm", 350, "bát", MealTimeSlot.BREAKFAST, "Bún nhâm đặc sản Hà Tiên");
                addDish(dishes, "Miến lươn nước", 380, "bát", MealTimeSlot.BREAKFAST, "Miến lươn nước ngọt thanh");
                addDish(dishes, "Bánh mì pate", 320, "cái", MealTimeSlot.BREAKFAST, "Bánh mì chỉ có pate và bơ");
                addDish(dishes, "Bún thịt nướng", 520, "tô", MealTimeSlot.BREAKFAST, "Bún thịt nướng miền Nam");
                addDish(dishes, "Cháo đậu xanh", 250, "bát", MealTimeSlot.BREAKFAST, "Cháo đậu xanh mát gan giải độc");
                addDish(dishes, "Xôi ngô", 400, "gói", MealTimeSlot.BREAKFAST, "Xôi bắp mỡ hành hành phi");
                addDish(dishes, "Bánh ít trần", 350, "cái", MealTimeSlot.BREAKFAST, "Bánh ít trần nhân tôm thịt");
                addDish(dishes, "Mì xào giòn", 650, "đĩa", MealTimeSlot.BREAKFAST, "Mì xào giòn hải sản thập cẩm");
                addDish(dishes, "Bún kèn", 400, "bát", MealTimeSlot.BREAKFAST, "Bún kèn cá nục trứ danh");
                addDish(dishes, "Bánh canh ghẹ", 550, "bát", MealTimeSlot.BREAKFAST, "Bánh canh ghẹ nguyên con");
                addDish(dishes, "Cháo trai", 350, "bát", MealTimeSlot.BREAKFAST, "Cháo trai dân dã ấm bụng");
                addDish(dishes, "Bún bò Nam Bộ", 480, "bát", MealTimeSlot.BREAKFAST, "Bún bò trộn kiểu Nam Bộ");
                addDish(dishes, "Xôi cốm", 450, "gói", MealTimeSlot.BREAKFAST, "Xôi cốm hạt sen dừa sợi");
                addDish(dishes, "Bánh canh giò heo", 600, "bát", MealTimeSlot.BREAKFAST, "Bánh canh giò heo miền Đông");
                addDish(dishes, "Bún chả cá Quy Nhơn", 420, "bát", MealTimeSlot.BREAKFAST,
                                "Bún chả cá Quy Nhơn đặc sản");
                addDish(dishes, "Cháo tim gan", 380, "bát", MealTimeSlot.BREAKFAST, "Cháo trắng nấu tim gan heo");
                addDish(dishes, "Mì tương đen", 500, "tô", MealTimeSlot.BREAKFAST, "Mì trộn sốt đậu đen");
                addDish(dishes, "Bún tôm", 380, "bát", MealTimeSlot.BREAKFAST, "Bún tôm Hải Dương thanh đạm");
                addDish(dishes, "Xôi lá dứa", 400, "gói", MealTimeSlot.BREAKFAST, "Xôi nếp thơm lá dứa béo cốt dừa");
                addDish(dishes, "Hủ tiếu chay", 350, "bát", MealTimeSlot.BREAKFAST, "Hủ tiếu nấu nấm và rau củ");

                // NEW LUNCH (50 món mới)
                addDish(dishes, "Cơm tấm sườn bì chả", 650, "đĩa", MealTimeSlot.LUNCH, "Cơm tấm đặc sản Sài Gòn");
                addDish(dishes, "Cá bống kho tiêu", 200, "đĩa nhỏ", MealTimeSlot.LUNCH,
                                "Cá bống sông kho tiêu cay nồng");
                addDish(dishes, "Sườn non kho tộ", 320, "tô nhỏ", MealTimeSlot.LUNCH, "Sườn non kho tộ đậm đà");
                addDish(dishes, "Vịt kho gừng", 380, "đĩa nhỏ", MealTimeSlot.LUNCH, "Thịt vịt kho gừng ấm áp");
                addDish(dishes, "Rau cải xào dầu hào", 120, "đĩa", MealTimeSlot.LUNCH, "Rau cải thìa xào dầu hào");
                addDish(dishes, "Thịt gà kho sả ớt", 300, "đĩa nhỏ", MealTimeSlot.LUNCH, "Gà ta kho sả ớt miền Trung");
                addDish(dishes, "Canh bầu nấu tôm", 90, "bát tô", MealTimeSlot.LUNCH, "Canh bầu nấu tôm tươi ngọt mát");
                addDish(dishes, "Thịt heo quay", 450, "đĩa nhỏ", MealTimeSlot.LUNCH, "Thịt heo quay giòn bì");
                addDish(dishes, "Mướp đắng nhồi thịt", 250, "bát tô", MealTimeSlot.LUNCH,
                                "Canh mướp đắng nhồi thịt giải nhiệt");
                addDish(dishes, "Tôm xào bông cải", 280, "đĩa", MealTimeSlot.LUNCH, "Tôm xào súp lơ xanh");
                addDish(dishes, "Cá thu kho thơm", 350, "đĩa", MealTimeSlot.LUNCH, "Cá thu kho với thơm (dứa)");
                addDish(dishes, "Trứng đúc thịt", 300, "miếng", MealTimeSlot.LUNCH, "Trứng vịt đúc thịt băm mộc nhĩ");
                addDish(dishes, "Canh rau cải nấu cá rô", 150, "bát tô", MealTimeSlot.LUNCH,
                                "Canh rau cải ngọt nấu cá rô đồng");
                addDish(dishes, "Thịt bò già xào cần", 320, "đĩa", MealTimeSlot.LUNCH, "Thịt bò xào rau cần tây");
                addDish(dishes, "Cá chép om dưa", 450, "bát tô", MealTimeSlot.LUNCH, "Cá chép om dưa chua đậm đà");
                addDish(dishes, "Mực rim me", 250, "đĩa", MealTimeSlot.LUNCH, "Mực khô rim me chua ngọt");
                addDish(dishes, "Chả quế", 320, "đĩa", MealTimeSlot.LUNCH, "Chả quế nướng thơm lừng");
                addDish(dishes, "Rau kho quẹt", 200, "đĩa", MealTimeSlot.LUNCH, "Rau củ luộc chấm kho quẹt tôm khô");
                addDish(dishes, "Dồi sụn nướng", 400, "suất", MealTimeSlot.LUNCH, "Dồi sụn nướng than hoa");
                addDish(dishes, "Canh khoai mỡ", 180, "bát tô", MealTimeSlot.LUNCH, "Canh khoai mỡ nấu tôm băm");
                addDish(dishes, "Nấm rơm xào thịt", 220, "đĩa", MealTimeSlot.LUNCH, "Nấm rơm xào ba chỉ heo");
                addDish(dishes, "Cá linh kho lạt", 280, "đĩa", MealTimeSlot.LUNCH,
                                "Cá linh kho lạt ăn kèm bông điên điển");
                addDish(dishes, "Gà chiên nước mắm", 450, "đĩa", MealTimeSlot.LUNCH, "Cánh gà chiên nước mắm đậm đà");
                addDish(dishes, "Canh xương hầm củ quả", 250, "bát tô", MealTimeSlot.LUNCH,
                                "Xương heo hầm khoai tây cà rốt");
                addDish(dishes, "Sò huyết xào tỏi", 300, "đĩa", MealTimeSlot.LUNCH, "Sò huyết cháy tỏi thơm ngon");
                addDish(dishes, "Cơm gà Hội An", 600, "đĩa", MealTimeSlot.LUNCH, "Cơm gà xé phay đặc sản");
                addDish(dishes, "Gỏi đu đủ tôm thịt", 350, "đĩa", MealTimeSlot.LUNCH, "Gỏi đu đủ xanh tôm thịt");
                addDish(dishes, "Cá cam kho tộ", 320, "đĩa", MealTimeSlot.LUNCH, "Cá cam kho tộ béo ngậy");
                addDish(dishes, "Thịt heo xào giá", 250, "đĩa", MealTimeSlot.LUNCH, "Thịt heo nạc xào giá đỗ");
                addDish(dishes, "Canh rau dền nấu thịt băm", 120, "bát tô", MealTimeSlot.LUNCH,
                                "Canh rau dền đỏ thịt nạc");
                addDish(dishes, "Lòng lợn luộc", 400, "đĩa", MealTimeSlot.LUNCH, "Lòng lợn thập cẩm luộc");
                addDish(dishes, "Gà xào sả ớt", 350, "đĩa", MealTimeSlot.LUNCH, "Thịt gà xào sả ớt cay nồng");
                addDish(dishes, "Canh chua cá linh", 200, "bát tô", MealTimeSlot.LUNCH,
                                "Canh chua cá linh hoa điên điển");
                addDish(dishes, "Bún đậu thịt luộc", 500, "mẹt", MealTimeSlot.LUNCH, "Bún đậu mắm tôm thịt heo luộc");
                addDish(dishes, "Cá lóc nướng trui", 400, "con", MealTimeSlot.LUNCH,
                                "Cá lóc nướng trui cuốn bánh tráng");
                addDish(dishes, "Sườn nướng mật ong", 500, "miếng", MealTimeSlot.LUNCH, "Sườn heo nướng mật ong");
                addDish(dishes, "Rau muống xanh luộc", 50, "đĩa", MealTimeSlot.LUNCH, "Rau muống luộc chấm tương");
                addDish(dishes, "Heo giả cầy", 550, "tô", MealTimeSlot.LUNCH, "Thịt heo nấu giả cầy đậm đà");
                addDish(dishes, "Lươn xào sả ớt", 380, "đĩa", MealTimeSlot.LUNCH, "Thịt lươn xào sả ớt cay thơm");
                addDish(dishes, "Canh bí đỏ nấu xương", 220, "bát tô", MealTimeSlot.LUNCH,
                                "Bí đỏ hầm xương heo bổ não");
                addDish(dishes, "Hến xào xúc bánh đa", 350, "đĩa", MealTimeSlot.LUNCH, "Hến xào sả ớt ăn kèm bánh đa");
                addDish(dishes, "Nem lụi", 450, "suất", MealTimeSlot.LUNCH, "Nem lụi nướng miền Trung");
                addDish(dishes, "Cá nục kho tiêu", 250, "đĩa", MealTimeSlot.LUNCH, "Cá nục kho tiêu ăn kèm cơm trắng");
                addDish(dishes, "Thịt bò xào đậu que", 280, "đĩa", MealTimeSlot.LUNCH,
                                "Thịt bò xào đậu que (đậu cô ve)");
                addDish(dishes, "Canh rong biển thịt băm", 150, "bát tô", MealTimeSlot.LUNCH,
                                "Canh rong biển nấu thịt nạc");
                addDish(dishes, "Tàu hũ kỵ xào rau củ", 220, "đĩa", MealTimeSlot.LUNCH, "Tàu hũ kỵ xào nấm và cà rốt");
                addDish(dishes, "Cá hố chiên sả ớt", 300, "đĩa", MealTimeSlot.LUNCH, "Cá hố chiên giòn cay");
                addDish(dishes, "Ốc nấu chuối đậu", 450, "tô", MealTimeSlot.LUNCH, "Ốc nhồi nấu chuối xanh đậu phụ");
                addDish(dishes, "Gà rang lá chanh", 350, "đĩa", MealTimeSlot.LUNCH, "Gà rang gừng lá chanh thơm nức");
                addDish(dishes, "Cơm lam thịt nướng", 600, "suất", MealTimeSlot.LUNCH, "Cơm lam Tây Bắc thịt nướng");

                // NEW DINNER (50 món mới)
                addDish(dishes, "Lẩu gà lá é", 1200, "nồi", MealTimeSlot.DINNER, "Lẩu gà đặc sản Đà Lạt");
                addDish(dishes, "Bò nhúng giấm", 800, "suất", MealTimeSlot.DINNER, "Lẩu bò nhúng giấm thanh chua");
                addDish(dishes, "Cá lóc nướng tỏi", 380, "con", MealTimeSlot.DINNER, "Cá lóc nướng mỡ hành tỏi");
                addDish(dishes, "Sườn xào chua ngọt (Dinner)", 450, "đĩa", MealTimeSlot.DINNER,
                                "Sườn xào chua ngọt kiểu Bắc");
                addDish(dishes, "Canh chua tôm", 180, "tô", MealTimeSlot.DINNER, "Canh chua tôm nấu dọc mùng");
                addDish(dishes, "Nộm bò bóp thấu", 350, "đĩa", MealTimeSlot.DINNER, "Thịt bò trộn khế chuối chát");
                addDish(dishes, "Mực nhồi thịt sốt cà", 500, "đĩa", MealTimeSlot.DINNER,
                                "Mực nhồi thịt băm sốt cà chua");
                addDish(dishes, "Gà hấp lá chanh", 400, "nửa con", MealTimeSlot.DINNER,
                                "Gà ta hấp lá chanh giữ vị ngọt");
                addDish(dishes, "Bò né", 750, "suất", MealTimeSlot.DINNER, "Bò né bánh mì trên chảo gang");
                addDish(dishes, "Cá lăng nướng", 450, "đĩa", MealTimeSlot.DINNER, "Cá lăng nướng riềng mẻ");
                addDish(dishes, "Ốc hương xào bơ tỏi", 550, "đĩa", MealTimeSlot.DINNER,
                                "Ốc hương cháy bơ tỏi thơm lừng");
                addDish(dishes, "Vịt quay Bắc Kinh", 1500, "con", MealTimeSlot.DINNER, "Vịt quay da giòn kiểu Trung");
                addDish(dishes, "Canh cua rau đay", 120, "tô", MealTimeSlot.DINNER, "Canh cua đồng rau đay mướp");
                addDish(dishes, "Gỏi sứa", 250, "đĩa", MealTimeSlot.DINNER, "Gỏi sứa giòn mát trộn lạc");
                addDish(dishes, "Tôm càng xanh nướng", 600, "suất", MealTimeSlot.DINNER, "Tôm càng xanh nướng mọi");
                addDish(dishes, "Bò sốt vang", 700, "tô", MealTimeSlot.DINNER, "Thịt bò hầm vang kèm bánh mì");
                addDish(dishes, "Cá quả nướng", 400, "con", MealTimeSlot.DINNER, "Cá quả nướng giấy bạc");
                addDish(dishes, "Càng ghẹ rang muối", 550, "đĩa", MealTimeSlot.DINNER, "Càng ghẹ rang muối ớt cay");
                addDish(dishes, "Lẩu thái hải sản", 1400, "nồi", MealTimeSlot.DINNER,
                                "Lẩu thái chua cay đầy đủ hải sản");
                addDish(dishes, "Bún mắm (Dinner)", 650, "bát", MealTimeSlot.DINNER, "Bún mắm miền Tây thập cẩm");
                addDish(dishes, "Chim bồ câu hầm", 500, "con", MealTimeSlot.DINNER, "Bồ câu hầm hạt sen thuốc bắc");
                addDish(dishes, "Sò lông nướng mỡ hành", 450, "đĩa", MealTimeSlot.DINNER,
                                "Sò lông nướng mỡ hành đậu phộng");
                addDish(dishes, "Gà nướng muối ớt", 1100, "con", MealTimeSlot.DINNER, "Gà thả vườn nướng muối ớt");
                addDish(dishes, "Bún bò Huế (Full)", 600, "bát", MealTimeSlot.DINNER, "Bún bò Huế đặc biệt đầy đủ");
                addDish(dishes, "Cá tầm nướng", 600, "đĩa", MealTimeSlot.DINNER, "Cá tầm nướng riềng sả");
                addDish(dishes, "Mực trứng chiên mắm", 550, "đĩa", MealTimeSlot.DINNER, "Mực trứng chiên nước mắm");
                addDish(dishes, "Heo quay kho dưa", 650, "tô", MealTimeSlot.DINNER, "Thịt heo quay kho với dưa cải");
                addDish(dishes, "Lẩu nấm chay", 800, "nồi", MealTimeSlot.DINNER, "Lẩu nấm thập cẩm rau củ");
                addDish(dishes, "Tôm sú sốt tiêu đen", 500, "đĩa", MealTimeSlot.DINNER, "Tôm sú sốt tiêu đen nồng nàn");
                addDish(dishes, "Bò cuộn nấm kim châm", 600, "đĩa", MealTimeSlot.DINNER, "Bò ba chỉ cuộn nấm nướng");
                addDish(dishes, "Cá hồi áp chảo", 450, "miếng", MealTimeSlot.DINNER, "Cá hồi áp chảo sốt chanh leo");
                addDish(dishes, "Súp vi cá", 1200, "bát", MealTimeSlot.DINNER, "Súp vi cá thượng hạng");
                addDish(dishes, "Mì Ý sốt bò băm", 850, "đĩa", MealTimeSlot.DINNER, "Pasta Bolognese kiểu Ý");
                addDish(dishes, "Bánh đa cua (Extra)", 550, "bát", MealTimeSlot.DINNER, "Bánh đa cua đầy đủ topping");
                addDish(dishes, "Gỏi gà ngó sen", 400, "đĩa", MealTimeSlot.DINNER, "Gỏi ngó sen trộn gà xé");
                addDish(dishes, "Vịt nướng chao", 950, "con", MealTimeSlot.DINNER, "Vịt nướng chao đỏ thơm lừng");
                addDish(dishes, "Cá đuối nướng sả ớt", 500, "đĩa", MealTimeSlot.DINNER, "Cá đuối nướng vị miền Trung");
                addDish(dishes, "Hủ tiếu Nam Vang (Dinner)", 550, "bát", MealTimeSlot.DINNER,
                                "Hủ tiếu Nam Vang khô đặc biệt");
                addDish(dishes, "Tôm lăn bột chiên", 750, "đĩa", MealTimeSlot.DINNER, "Tôm sú lăn bột chiên xù");
                addDish(dishes, "Cơm tấm (Dinner)", 700, "đĩa", MealTimeSlot.DINNER,
                                "Cơm tấm đặc sắc với ba rọi nướng");
                addDish(dishes, "Lẩu bò (Dinner)", 1300, "nồi", MealTimeSlot.DINNER, "Lẩu đuôi bò hầm thuốc bắc");
                addDish(dishes, "Cá linh chiên giòn", 350, "đĩa", MealTimeSlot.DINNER, "Cá linh lăn bột chiên giòn");
                addDish(dishes, "Bún riêu cua bắp bò", 550, "bát", MealTimeSlot.DINNER, "Bún riêu cua giò heo bắp bò");
                addDish(dishes, "Thịt heo rừng xào lăn", 600, "đĩa", MealTimeSlot.DINNER,
                                "Thịt heo rừng xào sả cốt dừa");
                addDish(dishes, "Canh ghẹ rau muống", 250, "tô", MealTimeSlot.DINNER, "Canh ghẹ tươi nấu rau muống");
                addDish(dishes, "Ốc móng tay xào rau muống", 350, "đĩa", MealTimeSlot.DINNER,
                                "Ốc móng tay xào tỏi rau muống");
                addDish(dishes, "Cá chẽm sốt ngũ liễu", 650, "con", MealTimeSlot.DINNER, "Cá chẽm chiên sốt rau củ");
                addDish(dishes, "Gà nướng lá tranh", 850, "con", MealTimeSlot.DINNER, "Gà thả vườn nướng lá chanh");
                addDish(dishes, "Bò cuộn lá lốt (Dinner)", 550, "suất", MealTimeSlot.DINNER, "Bò lá lốt nướng mỡ hành");
                addDish(dishes, "Mì xào hải sản (Dinner)", 750, "đĩa", MealTimeSlot.DINNER,
                                "Mì xào giòn hải sản thập cẩm");

                // NEW SNACK (50 món mới)
                addDish(dishes, "Bánh tráng nướng", 300, "cái", MealTimeSlot.SNACK, "Pizza kiểu Việt Nam");
                addDish(dishes, "Bột chiên", 450, "đĩa", MealTimeSlot.SNACK, "Bột chiên trứng kiểu Hoa");
                addDish(dishes, "Bánh xèo (Phụ)", 400, "cái", MealTimeSlot.SNACK, "Bánh xèo ăn xế chiều");
                addDish(dishes, "Ốc luộc", 200, "bát", MealTimeSlot.SNACK, "Ốc vặn luộc lá chanh");
                addDish(dishes, "Khoai tây chiên", 350, "phần", MealTimeSlot.SNACK, "Khoai tây chiên giòn rụm");
                addDish(dishes, "Bắp xào tôm bơ", 400, "hộp", MealTimeSlot.SNACK, "Bắp nếp xào tôm khô mỡ hành");
                addDish(dishes, "Trứng chén nướng", 250, "chén", MealTimeSlot.SNACK, "Trứng cút nướng mỡ hành");
                addDish(dishes, "Khô mực nướng", 150, "con", MealTimeSlot.SNACK, "Mực khô nướng xé sợi");
                addDish(dishes, "Gỏi bò khô", 300, "đĩa", MealTimeSlot.SNACK, "Nộm bò khô đu đủ");
                addDish(dishes, "Chân gà sả tắc", 450, "hộp", MealTimeSlot.SNACK, "Chân gà ngâm sả tắc cay giòn");
                addDish(dishes, "Bánh mì nướng muối ớt", 380, "suất", MealTimeSlot.SNACK, "Bánh mì ép nướng muối ớt");
                addDish(dishes, "Bánh tráng cuốn", 350, "suất", MealTimeSlot.SNACK, "Bánh tráng cuốn bơ tôm khô");
                addDish(dishes, "Cút lộn xào me", 500, "phần", MealTimeSlot.SNACK, "Trứng cút lộn sốt me chua ngọt");
                addDish(dishes, "Xoài lắc", 120, "ly", MealTimeSlot.SNACK, "Xoài xanh lắc muối ớt");
                addDish(dishes, "Bánh tai heo", 250, "nắm (50g)", MealTimeSlot.SNACK, "Bánh tai heo giòn thơm");
                addDish(dishes, "Kem tràng tiền", 150, "que", MealTimeSlot.SNACK, "Kem que đặc sản Hà Nội");
                addDish(dishes, "Chè Thái", 350, "ly", MealTimeSlot.SNACK, "Chè thái sầu riêng nước cốt dừa");
                addDish(dishes, "Sữa chua dẻo", 180, "ly", MealTimeSlot.SNACK, "Sữa chua cắt miếng dẻo mịn");
                addDish(dishes, "Bánh mì que", 150, "cái", MealTimeSlot.SNACK, "Bánh mì que cay Hải Phòng");
                addDish(dishes, "Nem chua rán", 400, "đĩa (5 cái)", MealTimeSlot.SNACK, "Nem chua tẩm bột chiên xù");
                addDish(dishes, "Chuối chiên", 250, "cái", MealTimeSlot.SNACK, "Chuối sứ tẩm bột chiên giòn");
                addDish(dishes, "Khoai mỡ chiên", 300, "phần", MealTimeSlot.SNACK, "Bánh khoai mỡ chiên giòn");
                addDish(dishes, "Phô mai que", 350, "que (3 cái)", MealTimeSlot.SNACK, "Phô mai que kéo sợi");
                addDish(dishes, "Bánh tráng tỏi", 200, "bịch", MealTimeSlot.SNACK, "Bánh tráng trộn tỏi phi muối ớt");
                addDish(dishes, "Há cảo hấp", 350, "đĩa", MealTimeSlot.SNACK, "Há cảo tôm thịt xửng hấp");
                addDish(dishes, "Bánh tráng long an", 250, "bịch", MealTimeSlot.SNACK, "Bánh tráng tôm khô hành phi");
                addDish(dishes, "Bún xào (Phụ)", 400, "đĩa", MealTimeSlot.SNACK, "Bún gạo xào chay xế chiều");
                addDish(dishes, "Rau câu dừa", 150, "trái", MealTimeSlot.SNACK, "Rau câu đổ trong trái dừa");
                addDish(dishes, "Bánh tằm khoai mì", 220, "đĩa", MealTimeSlot.SNACK, "Bánh tằm khoai mì sợi ngũ sắc");
                addDish(dishes, "Chuối nướng", 280, "cái", MealTimeSlot.SNACK, "Chuối nướng nếp cốt dừa");
                addDish(dishes, "Chè hạt sen", 180, "ly", MealTimeSlot.SNACK, "Chè hạt sen nhãn nhục");
                addDish(dishes, "Sâm bổ lượng", 200, "ly", MealTimeSlot.SNACK, "Chè sâm bổ lượng thanh mát");
                addDish(dishes, "Bánh bò thốt nốt", 250, "cái", MealTimeSlot.SNACK, "Bánh bò nướng thốt nốt An Giang");
                addDish(dishes, "Bánh bèo chén", 350, "khay (10 chén)", MealTimeSlot.SNACK,
                                "Bánh bèo chén mỡ hành tôm cháy");
                addDish(dishes, "Dừa dầm", 450, "ly", MealTimeSlot.SNACK, "Dừa dầm đặc sản Hải Phòng");
                addDish(dishes, "Sữa đậu nành", 150, "ly", MealTimeSlot.SNACK, "Sữa đậu nành nóng/lạnh tự nhiên");
                addDish(dishes, "Tào phớ", 120, "bát", MealTimeSlot.SNACK, "Tào phớ nước đường gừng");
                addDish(dishes, "Bánh quy bơ", 280, "nắm (50g)", MealTimeSlot.SNACK, "Bánh quy bơ giòn tan");
                addDish(dishes, "Hạt hướng dương", 160, "nắm (30g)", MealTimeSlot.SNACK,
                                "Nhâm nhi hạt hướng dương rang");
                addDish(dishes, "Bánh phục linh", 180, "cái (5 cái)", MealTimeSlot.SNACK,
                                "Bánh phục linh cốt dừa tan trong miệng");
                addDish(dishes, "Kem chuối", 200, "que", MealTimeSlot.SNACK, "Kem chuối ép dừa đậu phộng");
                addDish(dishes, "Xôi xiêm", 450, "hộp", MealTimeSlot.SNACK, "Xôi xiêm sầu riêng cốt dừa");
                addDish(dishes, "Bánh căn", 400, "đĩa", MealTimeSlot.SNACK, "Bánh căn nhân trứng cút nướng");
                addDish(dishes, "Gân bò ngâm sả tắc", 500, "hộp", MealTimeSlot.SNACK, "Gân bò giòn ngâm chua ngọt");
                addDish(dishes, "Bánh phồng tôm", 200, "đĩa", MealTimeSlot.SNACK, "Bánh phồng tôm chiên giòn");
                addDish(dishes, "Nộm sứa tôm thịt", 300, "đĩa", MealTimeSlot.SNACK, "Nộm sứa thanh mát chiều hè");
                addDish(dishes, "Bánh gối", 380, "cái", MealTimeSlot.SNACK, "Bánh gối nhân thịt trứng cút");
                addDish(dishes, "Bánh tôm Hồ Tây", 450, "cái", MealTimeSlot.SNACK,
                                "Bánh tôm chiên giòn đặc sản Hà Nội");
                addDish(dishes, "Trứng nướng mỡ hành", 180, "quả", MealTimeSlot.SNACK,
                                "Trứng gà nướng gia vị phết mỡ hành");
                addDish(dishes, "Thạch lá dứa", 80, "ly", MealTimeSlot.SNACK, "Thạch lá dứa giòn mát");

                repository.saveAll(dishes);
                System.out.println("✅ DishLibrary seeded with 300 Vietnamese dishes.");
        }

        private void addDish(List<DishLibrary> list, String name, int calo, String unit, MealTimeSlot slot,
                        String description) {
                list.add(DishLibrary.builder()
                                .name(name)
                                .baseCalories(calo)
                                .unit(unit)
                                .category(slot)
                                .isAiSuggested(false)
                                .isVerified(true) // Dữ liệu seeder mặc định là đã xác thực
                                .description(description)
                                .build());
        }
}
