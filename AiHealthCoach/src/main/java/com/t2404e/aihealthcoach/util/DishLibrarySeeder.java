package com.t2404e.aihealthcoach.util;

import com.t2404e.aihealthcoach.entity.DishLibrary;
import com.t2404e.aihealthcoach.enums.MealTimeSlot;
import com.t2404e.aihealthcoach.repository.DishLibraryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DishLibrarySeeder implements CommandLineRunner {

    private final DishLibraryRepository repository;

    @Override
    public void run(String... args) {
        if (repository.count() > 0) {
            return; // Tránh insert trùng lặp
        }

        List<DishLibrary> dishes = new ArrayList<>();

        // BREAKFAST (25 món)
        addDish(dishes, "Phở bò", 450, "bát", MealTimeSlot.BREAKFAST);
        addDish(dishes, "Phở gà", 400, "bát", MealTimeSlot.BREAKFAST);
        addDish(dishes, "Bún chả", 500, "suất", MealTimeSlot.BREAKFAST);
        addDish(dishes, "Bún bò Huế", 480, "bát", MealTimeSlot.BREAKFAST);
        addDish(dishes, "Bánh mì thịt", 350, "cái", MealTimeSlot.BREAKFAST);
        addDish(dishes, "Bánh mì trứng", 300, "cái", MealTimeSlot.BREAKFAST);
        addDish(dishes, "Xôi xéo", 450, "gói", MealTimeSlot.BREAKFAST);
        addDish(dishes, "Xôi gà", 500, "gói", MealTimeSlot.BREAKFAST);
        addDish(dishes, "Bánh cuốn", 350, "đĩa", MealTimeSlot.BREAKFAST);
        addDish(dishes, "Bánh giò", 300, "cái", MealTimeSlot.BREAKFAST);
        addDish(dishes, "Cháo lòng", 350, "bát", MealTimeSlot.BREAKFAST);
        addDish(dishes, "Cháo gà", 300, "bát", MealTimeSlot.BREAKFAST);
        addDish(dishes, "Mì tôm trứng", 350, "bát", MealTimeSlot.BREAKFAST);
        addDish(dishes, "Bún riêu cua", 400, "bát", MealTimeSlot.BREAKFAST);
        addDish(dishes, "Bún mọc", 380, "bát", MealTimeSlot.BREAKFAST);
        addDish(dishes, "Bánh mì chảo", 550, "suất", MealTimeSlot.BREAKFAST);
        addDish(dishes, "Bánh bao nhân thịt", 350, "cái", MealTimeSlot.BREAKFAST);
        addDish(dishes, "Miến gà", 350, "bát", MealTimeSlot.BREAKFAST);
        addDish(dishes, "Bún thang", 400, "bát", MealTimeSlot.BREAKFAST);
        addDish(dishes, "Bánh mì ốp la", 320, "cái", MealTimeSlot.BREAKFAST);
        addDish(dishes, "Súp cua", 250, "bát", MealTimeSlot.BREAKFAST);
        addDish(dishes, "Bánh xèo", 450, "cái", MealTimeSlot.BREAKFAST);
        addDish(dishes, "Bánh khọt", 350, "đĩa (5 cái)", MealTimeSlot.BREAKFAST);
        addDish(dishes, "Hủ tiếu Nam Vang", 450, "bát", MealTimeSlot.BREAKFAST);
        addDish(dishes, "Bún đậu mắm tôm", 550, "mẹt", MealTimeSlot.BREAKFAST);

        // LUNCH (25 món)
        addDish(dishes, "Cơm trắng", 130, "bát (100g)", MealTimeSlot.LUNCH);
        addDish(dishes, "Cá kho tộ", 250, "tô nhỏ", MealTimeSlot.LUNCH);
        addDish(dishes, "Thịt kho tàu", 350, "tô nhỏ", MealTimeSlot.LUNCH);
        addDish(dishes, "Gà rang sả ớt", 300, "đĩa nhỏ", MealTimeSlot.LUNCH);
        addDish(dishes, "Rau muống xào tỏi", 100, "đĩa", MealTimeSlot.LUNCH);
        addDish(dishes, "Đậu phụ sốt cà chua", 200, "đĩa", MealTimeSlot.LUNCH);
        addDish(dishes, "Canh chua cá lóc", 150, "bát tô", MealTimeSlot.LUNCH);
        addDish(dishes, "Sườn xào chua ngọt", 350, "đĩa", MealTimeSlot.LUNCH);
        addDish(dishes, "Bò xào thiên lý", 250, "đĩa", MealTimeSlot.LUNCH);
        addDish(dishes, "Mực xào cần tỏi", 200, "đĩa", MealTimeSlot.LUNCH);
        addDish(dishes, "Trứng chiên", 150, "cái", MealTimeSlot.LUNCH);
        addDish(dishes, "Cá diêu hồng chiên xù", 300, "con nhỏ", MealTimeSlot.LUNCH);
        addDish(dishes, "Tôm rang thịt ba chỉ", 350, "đĩa", MealTimeSlot.LUNCH);
        addDish(dishes, "Canh mồng tơi nấu tôm", 80, "bát tô", MealTimeSlot.LUNCH);
        addDish(dishes, "Rau lang luộc", 50, "đĩa", MealTimeSlot.LUNCH);
        addDish(dishes, "Chả lá lốt", 300, "đĩa (5-6 cái)", MealTimeSlot.LUNCH);
        addDish(dishes, "Bò kho", 450, "bát", MealTimeSlot.LUNCH);
        addDish(dishes, "Gà luộc", 250, "đĩa nhỏ", MealTimeSlot.LUNCH);
        addDish(dishes, "Nem rán (Chả giò)", 400, "đĩa (4-5 cái)", MealTimeSlot.LUNCH);
        addDish(dishes, "Canh rau ngót nấu thịt băm", 100, "bát tô", MealTimeSlot.LUNCH);
        addDish(dishes, "Giá đỗ xào lòng gà", 200, "đĩa", MealTimeSlot.LUNCH);
        addDish(dishes, "Măng kho thịt", 300, "đĩa", MealTimeSlot.LUNCH);
        addDish(dishes, "Cá thu sốt cà chua", 280, "lát", MealTimeSlot.LUNCH);
        addDish(dishes, "Khổ qua xào trứng", 150, "đĩa", MealTimeSlot.LUNCH);
        addDish(dishes, "Cơm rang dưa bò", 600, "đĩa", MealTimeSlot.LUNCH);

        // DINNER (25 món)
        addDish(dishes, "Cơm niêu", 200, "niêu nhỏ", MealTimeSlot.DINNER);
        addDish(dishes, "Cá lóc hấp bầu", 180, "đĩa", MealTimeSlot.DINNER);
        addDish(dishes, "Tôm rim mặn ngọt", 220, "đĩa", MealTimeSlot.DINNER);
        addDish(dishes, "Đậu bắp luộc", 40, "đĩa", MealTimeSlot.DINNER);
        addDish(dishes, "Canh đại dương", 50, "bát", MealTimeSlot.DINNER);
        addDish(dishes, "Nộm đu đủ gà xé", 150, "đĩa", MealTimeSlot.DINNER);
        addDish(dishes, "Gỏi cuốn", 60, "cái", MealTimeSlot.DINNER);
        addDish(dishes, "Bí đỏ xào tỏi", 120, "đĩa", MealTimeSlot.DINNER);
        addDish(dishes, "Thịt bò trộn dầu giấm", 250, "đĩa", MealTimeSlot.DINNER);
        addDish(dishes, "Cá hường chiên", 230, "con", MealTimeSlot.DINNER);
        addDish(dishes, "Canh bí xanh nấu tôm", 70, "bát tô", MealTimeSlot.DINNER);
        addDish(dishes, "Bắp cải xào", 90, "đĩa", MealTimeSlot.DINNER);
        addDish(dishes, "Trứng luộc", 70, "quả", MealTimeSlot.DINNER);
        addDish(dishes, "Đậu phụ luộc", 120, "bìa", MealTimeSlot.DINNER);
        addDish(dishes, "Canh cua mồng tơi", 110, "bát tô", MealTimeSlot.DINNER);
        addDish(dishes, "Gà kho gừng", 280, "đĩa", MealTimeSlot.DINNER);
        addDish(dishes, "Ba chỉ luộc", 300, "đĩa", MealTimeSlot.DINNER);
        addDish(dishes, "Rau củ quả luộc chấm kho quẹt", 250, "đĩa", MealTimeSlot.DINNER);
        addDish(dishes, "Cá cơm kho tiêu", 180, "đĩa nhỏ", MealTimeSlot.DINNER);
        addDish(dishes, "Canh khổ qua nhồi thịt", 200, "bát", MealTimeSlot.DINNER);
        addDish(dishes, "Mướp xào lòng mề", 180, "đĩa", MealTimeSlot.DINNER);
        addDish(dishes, "Thịt bò xào bông cải", 220, "đĩa", MealTimeSlot.DINNER);
        addDish(dishes, "Đậu hũ chiên sả ớt", 250, "đĩa", MealTimeSlot.DINNER);
        addDish(dishes, "Canh cải xanh nấu cá", 130, "bát tô", MealTimeSlot.DINNER);
        addDish(dishes, "Súp ngô gà", 180, "bát", MealTimeSlot.DINNER);

        // SNACK (25 món)
        addDish(dishes, "Chè bưởi", 250, "bát", MealTimeSlot.SNACK);
        addDish(dishes, "Chè đỗ đen", 200, "bát", MealTimeSlot.SNACK);
        addDish(dishes, "Chè dưỡng nhan", 150, "bát", MealTimeSlot.SNACK);
        addDish(dishes, "Sữa chua nếp cẩm", 200, "hũ", MealTimeSlot.SNACK);
        addDish(dishes, "Trái cây tô", 150, "bát", MealTimeSlot.SNACK);
        addDish(dishes, "Quả cam", 50, "quả", MealTimeSlot.SNACK);
        addDish(dishes, "Quả táo", 60, "quả", MealTimeSlot.SNACK);
        addDish(dishes, "Quả chuối", 90, "quả", MealTimeSlot.SNACK);
        addDish(dishes, "Thạch rau câu", 80, "đĩa", MealTimeSlot.SNACK);
        addDish(dishes, "Bánh flan", 160, "cái", MealTimeSlot.SNACK);
        addDish(dishes, "Sữa tươi không đường", 120, "hộp 180ml", MealTimeSlot.SNACK);
        addDish(dishes, "Các loại hạt", 160, "nắm nhỏ (30g)", MealTimeSlot.SNACK);
        addDish(dishes, "Khoai lang tím luộc", 120, "củ vừa", MealTimeSlot.SNACK);
        addDish(dishes, "Ngô luộc", 150, "bắp", MealTimeSlot.SNACK);
        addDish(dishes, "Bánh giò (phụ)", 300, "cái", MealTimeSlot.SNACK);
        addDish(dishes, "Nước ép cần tây", 40, "cốc", MealTimeSlot.SNACK);
        addDish(dishes, "Sinh tố bơ", 250, "cốc", MealTimeSlot.SNACK);
        addDish(dishes, "Nước dừa", 60, "trái", MealTimeSlot.SNACK);
        addDish(dishes, "Bánh bò", 120, "cái", MealTimeSlot.SNACK);
        addDish(dishes, "Bánh da lợn", 150, "miếng", MealTimeSlot.SNACK);
        addDish(dishes, "Trứng vịt lộn", 180, "quả", MealTimeSlot.SNACK);
        addDish(dishes, "Nem chua", 40, "cái nhỏ", MealTimeSlot.SNACK);
        addDish(dishes, "Cá viên chiên", 250, "xiên (5 cái)", MealTimeSlot.SNACK);
        addDish(dishes, "Bánh tráng trộn", 350, "suất", MealTimeSlot.SNACK);
        addDish(dishes, "Trà sữa", 350, "cốc", MealTimeSlot.SNACK);

        repository.saveAll(dishes);
        System.out.println("✅ DishLibrary seeded with 100 Vietnamese dishes.");
    }

    private void addDish(List<DishLibrary> list, String name, int calo, String unit, MealTimeSlot slot) {
        list.add(DishLibrary.builder()
                .name(name)
                .baseCalories(calo)
                .unit(unit)
                .category(slot)
                .isAiSuggested(false)
                .build());
    }
}
