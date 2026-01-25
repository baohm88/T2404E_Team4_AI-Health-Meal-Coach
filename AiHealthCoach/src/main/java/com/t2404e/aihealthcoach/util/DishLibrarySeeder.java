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
            // Nếu đã có dữ liệu, kiểm tra xem có món nào chưa được verify không (đặc biệt
            // là sau khi update schema)
            long unverifiedCount = repository.findAll().stream().filter(d -> !Boolean.TRUE.equals(d.getIsVerified()))
                    .count();
            if (unverifiedCount > 0) {
                System.out.println("🔄 Đang tự động xác thực " + unverifiedCount + " món ăn mẫu trong database...");
                repository.findAll().forEach(d -> {
                    if (d.getIsVerified() == null || !d.getIsVerified()) {
                        d.setIsVerified(true);
                        repository.save(d);
                    }
                });
                System.out.println("✅ Đã xác thực xong dữ liệu mẫu.");
            }
            return;
        }

        List<DishLibrary> dishes = new ArrayList<>();

        // BREAKFAST (25 món)
        addDish(dishes, "Phở bò", 450, "bát", MealTimeSlot.BREAKFAST,
                "Phở bò tái chín với nước dùng ninh xương đậm đà");
        addDish(dishes, "Phở gà", 400, "bát", MealTimeSlot.BREAKFAST, "Phở gà ta thịt dai ngọt, nước dùng thanh nhẹ");
        addDish(dishes, "Bún chả", 500, "suất", MealTimeSlot.BREAKFAST, "Bún chả Hà Nội nướng than hoa thơm lừng");
        addDish(dishes, "Bún bò Huế", 480, "bát", MealTimeSlot.BREAKFAST,
                "Bún bò Huế cay nồng, chân giò heo và chả cua");
        addDish(dishes, "Bánh mì thịt", 350, "cái", MealTimeSlot.BREAKFAST, "Bánh mì kẹp thịt nướng, pate và rau sống");
        addDish(dishes, "Bánh mì trứng", 300, "cái", MealTimeSlot.BREAKFAST, "Bánh mì ốp la đơn giản, giàu năng lượng");
        addDish(dishes, "Xôi xéo", 450, "gói", MealTimeSlot.BREAKFAST, "Xôi xéo đậu xanh hành phi mỡ gà béo ngậy");
        addDish(dishes, "Xôi gà", 500, "gói", MealTimeSlot.BREAKFAST, "Xôi nếp dẻo ăn kèm thịt gà xé phay");
        addDish(dishes, "Bánh cuốn", 350, "đĩa", MealTimeSlot.BREAKFAST, "Bánh cuốn nhân thịt mộc nhĩ chấm nước mắm");
        addDish(dishes, "Bánh giò", 300, "cái", MealTimeSlot.BREAKFAST, "Bánh giò nóng hổi nhân thịt băm mộc nhĩ");
        addDish(dishes, "Cháo lòng", 350, "bát", MealTimeSlot.BREAKFAST, "Cháo lòng heo đầy đủ dinh dưỡng");
        addDish(dishes, "Cháo gà", 300, "bát", MealTimeSlot.BREAKFAST, "Cháo gà hạt sen bổ dưỡng, dễ tiêu hóa");
        addDish(dishes, "Mì tôm trứng", 350, "bát", MealTimeSlot.BREAKFAST, "Mì gói nấu trứng chần nhanh gọn");
        addDish(dishes, "Bún riêu cua", 400, "bát", MealTimeSlot.BREAKFAST, "Bún riêu cua đồng vị chua thanh mát");
        addDish(dishes, "Bún mọc", 380, "bát", MealTimeSlot.BREAKFAST, "Bún mọc viên giòn dai, nước dùng ngọt thanh");
        addDish(dishes, "Bánh mì chảo", 550, "suất", MealTimeSlot.BREAKFAST, "Bánh mì chảo thập cẩm xúc xích pate");
        addDish(dishes, "Bánh bao nhân thịt", 350, "cái", MealTimeSlot.BREAKFAST,
                "Bánh bao nhân thịt trứng cút nóng hổi");
        addDish(dishes, "Miến gà", 350, "bát", MealTimeSlot.BREAKFAST, "Miến măng gà nước dùng trong veo");
        addDish(dishes, "Bún thang", 400, "bát", MealTimeSlot.BREAKFAST, "Bún thang Hà Nội tinh tế, nhiều topping");
        addDish(dishes, "Bánh mì ốp la", 320, "cái", MealTimeSlot.BREAKFAST, "Bánh mì kẹp trứng ốp la lòng đào");
        addDish(dishes, "Súp cua", 250, "bát", MealTimeSlot.BREAKFAST, "Súp cua đặc sánh, thơm ngon bổ dưỡng");
        addDish(dishes, "Bánh xèo", 450, "cái", MealTimeSlot.BREAKFAST, "Bánh xèo miền Tây giòn rụm nhân tôm thịt");
        addDish(dishes, "Bánh khọt", 350, "đĩa (5 cái)", MealTimeSlot.BREAKFAST, "Bánh khọt cốt dừa béo ngậy nhân tôm");
        addDish(dishes, "Hủ tiếu Nam Vang", 450, "bát", MealTimeSlot.BREAKFAST,
                "Hủ tiếu Nam Vang đậm đà hương vị miền Nam");
        addDish(dishes, "Bún đậu mắm tôm", 550, "mẹt", MealTimeSlot.BREAKFAST, "Bún đậu mắm tôm full topping dồi sụn");

        // LUNCH (25 món)
        addDish(dishes, "Cơm trắng", 130, "bát (100g)", MealTimeSlot.LUNCH, "Cơm trắng dẻo thơm từ gạo ngon");
        addDish(dishes, "Cá kho tộ", 250, "tô nhỏ", MealTimeSlot.LUNCH, "Cá lóc kho tộ đậm đà đưa cơm");
        addDish(dishes, "Thịt kho tàu", 350, "tô nhỏ", MealTimeSlot.LUNCH, "Thịt kho trứng vịt nước dừa mềm ngon");
        addDish(dishes, "Gà rang sả ớt", 300, "đĩa nhỏ", MealTimeSlot.LUNCH,
                "Gà rang sả ớt cay nồng kích thích vị giác");
        addDish(dishes, "Rau muống xào tỏi", 100, "đĩa", MealTimeSlot.LUNCH, "Rau muống xào tỏi xanh mướt giòn ngon");
        addDish(dishes, "Đậu phụ sốt cà chua", 200, "đĩa", MealTimeSlot.LUNCH,
                "Đậu phụ chiên sốt cà chua đơn giản mà ngon");
        addDish(dishes, "Canh chua cá lóc", 150, "bát tô", MealTimeSlot.LUNCH, "Canh chua cá lóc giải nhiệt ngày hè");
        addDish(dishes, "Sườn xào chua ngọt", 350, "đĩa", MealTimeSlot.LUNCH, "Sườn non xào chua ngọt đậm đà");
        addDish(dishes, "Bò xào thiên lý", 250, "đĩa", MealTimeSlot.LUNCH, "Thịt bò xào hoa thiên lý thơm mát");
        addDish(dishes, "Mực xào cần tỏi", 200, "đĩa", MealTimeSlot.LUNCH, "Mực tươi xào cần tỏi tây giòn ngọt");
        addDish(dishes, "Trứng chiên", 150, "cái", MealTimeSlot.LUNCH, "Trứng gà chiên hành tây thơm lừng");
        addDish(dishes, "Cá diêu hồng chiên xù", 300, "con nhỏ", MealTimeSlot.LUNCH,
                "Cá diêu hồng chiên giòn chấm nước mắm tỏi ớt");
        addDish(dishes, "Tôm rang thịt ba chỉ", 350, "đĩa", MealTimeSlot.LUNCH, "Tôm rang thịt cháy cạnh đậm đà");
        addDish(dishes, "Canh mồng tơi nấu tôm", 80, "bát tô", MealTimeSlot.LUNCH,
                "Canh rau mồng tơi nấu tôm khô ngọt mát");
        addDish(dishes, "Rau lang luộc", 50, "đĩa", MealTimeSlot.LUNCH, "Rau lang luộc chấm nước mắm tỏi");
        addDish(dishes, "Chả lá lốt", 300, "đĩa (5-6 cái)", MealTimeSlot.LUNCH, "Chả thịt cuốn lá lốt chiên thơm nức");
        addDish(dishes, "Bò kho", 450, "bát", MealTimeSlot.LUNCH, "Bò kho ngũ vị hương ăn kèm bánh mì hoặc cơm");
        addDish(dishes, "Gà luộc", 250, "đĩa nhỏ", MealTimeSlot.LUNCH, "Thịt gà ta luộc lá chanh da giòn");
        addDish(dishes, "Nem rán (Chả giò)", 400, "đĩa (4-5 cái)", MealTimeSlot.LUNCH,
                "Nem rán nhân thịt thập cẩm giòn rụm");
        addDish(dishes, "Canh rau ngót nấu thịt băm", 100, "bát tô", MealTimeSlot.LUNCH,
                "Canh rau ngót thịt nạc bổ dưỡng");
        addDish(dishes, "Giá đỗ xào lòng gà", 200, "đĩa", MealTimeSlot.LUNCH, "Giá đỗ xào lòng mề gà giòn sần sật");
        addDish(dishes, "Măng kho thịt", 300, "đĩa", MealTimeSlot.LUNCH, "Thịt ba chỉ kho măng tươi đậm đà");
        addDish(dishes, "Cá thu sốt cà chua", 280, "lát", MealTimeSlot.LUNCH, "Cá thu chiên sốt cà chua giàu Omega 3");
        addDish(dishes, "Khổ qua xào trứng", 150, "đĩa", MealTimeSlot.LUNCH,
                "Mướp đắng xào trứng vị nhẫn đắng tốt cho sức khỏe");
        addDish(dishes, "Cơm rang dưa bò", 600, "đĩa", MealTimeSlot.LUNCH, "Cơm rang dưa chua thịt bò đậm vị");

        // DINNER (25 món)
        addDish(dishes, "Cơm niêu", 200, "niêu nhỏ", MealTimeSlot.DINNER, "Cơm niêu nấu nồi đất hạt dẻo thơm");
        addDish(dishes, "Cá lóc hấp bầu", 180, "đĩa", MealTimeSlot.DINNER, "Cá lóc hấp bầu ngọt thanh tự nhiên");
        addDish(dishes, "Tôm rim mặn ngọt", 220, "đĩa", MealTimeSlot.DINNER, "Tôm đồng rim mặn ngọt đưa cơm");
        addDish(dishes, "Đậu bắp luộc", 40, "đĩa", MealTimeSlot.DINNER, "Đậu bắp luộc chấm chao");
        addDish(dishes, "Canh đại dương", 50, "bát", MealTimeSlot.DINNER, "Canh rong biển nấu đậu hũ non");
        addDish(dishes, "Nộm đu đủ gà xé", 150, "đĩa", MealTimeSlot.DINNER, "Nộm đu đủ tai heo tôm thịt chua ngọt");
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
        addDish(dishes, "Mướp xào lòng mề", 180, "đĩa", MealTimeSlot.DINNER, "Mướp hương xào lòng gà thơm ngọt");
        addDish(dishes, "Thịt bò xào bông cải", 220, "đĩa", MealTimeSlot.DINNER, "Thịt bò xào súp lơ xanh giàu sắt");
        addDish(dishes, "Đậu hũ chiên sả ớt", 250, "đĩa", MealTimeSlot.DINNER, "Đậu hũ chiên tẩm sả ớt giòn cay");
        addDish(dishes, "Canh cải xanh nấu cá", 130, "bát tô", MealTimeSlot.DINNER, "Canh cải bẹ xanh nấu cá rô đồng");
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
        addDish(dishes, "Khoai lang tím luộc", 120, "củ vừa", MealTimeSlot.SNACK, "Khoai lang tím luộc giảm cân");
        addDish(dishes, "Ngô luộc", 150, "bắp", MealTimeSlot.SNACK, "Ngô nếp luộc dẻo thơm");
        addDish(dishes, "Bánh giò (phụ)", 300, "cái", MealTimeSlot.SNACK, "Bữa phụ với bánh giò nóng");
        addDish(dishes, "Nước ép cần tây", 40, "cốc", MealTimeSlot.SNACK, "Nước ép cần tây thanh lọc detox");
        addDish(dishes, "Sinh tố bơ", 250, "cốc", MealTimeSlot.SNACK, "Sinh tố bơ cốt dừa béo ngậy");
        addDish(dishes, "Nước dừa", 60, "trái", MealTimeSlot.SNACK, "Nước dừa xiêm tươi mát lành");
        addDish(dishes, "Bánh bò", 120, "cái", MealTimeSlot.SNACK, "Bánh bò thốt nốt rễ tre mềm xốp");
        addDish(dishes, "Bánh da lợn", 150, "miếng", MealTimeSlot.SNACK, "Bánh da lợn đậu xanh lá dứa dẻo thơm");
        addDish(dishes, "Trứng vịt lộn", 180, "quả", MealTimeSlot.SNACK, "Trứng vịt lộn hầm ngải cứu");
        addDish(dishes, "Nem chua", 40, "cái nhỏ", MealTimeSlot.SNACK, "Nem chua Thanh Hóa tỏi ớt");
        addDish(dishes, "Cá viên chiên", 250, "xiên (5 cái)", MealTimeSlot.SNACK, "Cá viên chiên nước mắm");
        addDish(dishes, "Bánh tráng trộn", 350, "suất", MealTimeSlot.SNACK, "Bánh tráng trộn bò khô xoài xanh");
        addDish(dishes, "Trà sữa", 350, "cốc", MealTimeSlot.SNACK, "Trà sữa trân châu đường đen (hạn chế uống)");

        repository.saveAll(dishes);
        System.out.println("✅ DishLibrary seeded with 100 Vietnamese dishes.");
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
