// AI Service - Mock API for AI Coach chat
import { AI_RESPONSES, ChatMessage } from '@/lib/mock-data';

export const aiService = {
    // Send message and get AI response
    sendMessage: async (message: string): Promise<ChatMessage> => {
        return new Promise((resolve) => {
            // Simulate AI thinking time
            setTimeout(() => {
                const randomResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];

                // Generate contextual response based on keywords
                let response = randomResponse;
                if (message.toLowerCase().includes('giảm cân')) {
                    response = 'Để giảm cân hiệu quả, bạn nên tạo calorie deficit (tiêu thụ ít hơn 300-500 kcal so với nhu cầu). Kết hợp với tập luyện 3-4 buổi/tuần và uống đủ 2L nước mỗi ngày.';
                } else if (message.toLowerCase().includes('protein')) {
                    response = 'Lượng protein khuyến nghị là 1.6-2.2g/kg cân nặng cho người tập gym. Với cân nặng 70kg, bạn nên ăn 112-154g protein mỗi ngày. Nguồn tốt: ức gà, cá, trứng, đậu phụ.';
                } else if (message.toLowerCase().includes('bữa sáng') || message.toLowerCase().includes('sáng')) {
                    response = 'Gợi ý bữa sáng healthy:\n🥚 2 trứng luộc (156 kcal)\n🥑 1/2 quả bơ (80 kcal)\n🍞 1 lát bánh mì đen (80 kcal)\n🥛 Sữa không đường (60 kcal)\n\nTổng: ~376 kcal - Giàu protein, giúp no lâu!';
                }

                resolve({
                    id: `ai_${Date.now()}`,
                    role: 'ai',
                    content: response,
                    timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                });
            }, 1500); // 1.5s delay to simulate AI thinking
        });
    },
};
