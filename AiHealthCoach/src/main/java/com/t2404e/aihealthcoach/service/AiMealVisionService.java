package com.t2404e.aihealthcoach.service;

import com.t2404e.aihealthcoach.dto.response.ai.MealAnalysisResponse;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeTypeUtils;

import java.net.MalformedURLException;

@Service
public class AiMealVisionService {

    private final ChatClient chatClient;

    public AiMealVisionService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public MealAnalysisResponse analyzeMealImage(String imageUrl) throws MalformedURLException {
        String systemPrompt = """
                Bạn là một chuyên gia dinh dưỡng có khả năng phân tích hình ảnh món ăn.
                Nhiệm vụ của bạn là xem ảnh món ăn và trả về kết quả dưới dạng JSON.

                QUY TẮC:
                1. TRẢ JSON DUY NHẤT. KHÔNG CÓ TEXT BÊN NGOÀI.
                2. Ngôn ngữ: TIẾNG VIỆT.
                3. Ước lượng Calo phải dựa trên kiến thức dinh dưỡng thực tế.
                4. Field names giữ nguyên bằng tiếng Anh theo cấu trúc:
                {
                  "foodName": "string",
                  "estimatedCalories": number,
                  "nutritionDetails": "string (Phân tích chi tiết protein, carb, fat, vitamin...)"
                }
                """;

        UrlResource resource = new UrlResource(imageUrl);

        return chatClient.prompt()
                .system(systemPrompt)
                .user(u -> u.text("Hãy phân tích món ăn trong ảnh này.")
                        .media(MimeTypeUtils.IMAGE_JPEG, resource))
                .call()
                .entity(MealAnalysisResponse.class);
    }

    public MealAnalysisResponse analyzeMealText(String text) {
        String systemPrompt = """
                Bạn là một chuyên gia dinh dưỡng có khả năng phân tích tên hoặc mô tả món ăn.
                Nhiệm vụ của bạn là nhận text mô tả bữa ăn và trả về kết quả dưới dạng JSON.

                QUY TẮC:
                1. TRẢ JSON DUY NHẤT. KHÔNG CÓ TEXT BÊN NGOÀI.
                2. Ngôn ngữ: TIẾNG VIỆT.
                3. Ước lượng Calo phải dựa trên kiến thức dinh dưỡng thực tế.
                4. Field names giữ nguyên bằng tiếng Anh theo cấu trúc:
                {
                  "foodName": "string (Tên món ăn chính xác nhất)",
                  "estimatedCalories": number,
                  "nutritionDetails": "string (Phân tích chi tiết protein, carb, fat, vitamin...)"
                }
                """;

        return chatClient.prompt()
                .system(systemPrompt)
                .user(text)
                .call()
                .entity(MealAnalysisResponse.class);
    }
}
