// Mock Data for Dashboard Testing
// This file provides fake data for UI development without a backend

export const MOCK_USER = {
    id: 'user_001',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    avatar: undefined as string | undefined,
    joinedAt: '2024-01-15',
    profile: {
        height: 175,
        weight: 70,
        gender: 'MALE',
        goal: 'WEIGHT_LOSS',
        activityLevel: 'MODERATE',
    },
};

export const MOCK_STATS = {
    caloriesGoal: 2000,
    caloriesIn: 1450,
    caloriesOut: 320,
    caloriesRemaining: 550,
    waterIntake: 5,
    waterGoal: 8,
    macros: {
        protein: { current: 85, goal: 120, unit: 'g' },
        carbs: { current: 180, goal: 250, unit: 'g' },
        fat: { current: 45, goal: 65, unit: 'g' },
    },
    steps: 6500,
    stepsGoal: 10000,
};

export const MOCK_MEALS = [
    { id: 'meal_001', type: 'breakfast', name: 'Phở bò', calories: 450, time: '07:30', icon: '🍜' },
    { id: 'meal_002', type: 'lunch', name: 'Cơm gà xối mỡ', calories: 650, time: '12:00', icon: '🍗' },
    { id: 'meal_003', type: 'snack', name: 'Trái cây hỗn hợp', calories: 120, time: '15:30', icon: '🍎' },
    { id: 'meal_004', type: 'dinner', name: 'Canh chua cá lóc', calories: 380, time: '19:00', icon: '🍲' },
];

export const MOCK_WEEKLY_DATA = [
    { day: 'T2', calories: 1850, goal: 2000 },
    { day: 'T3', calories: 2100, goal: 2000 },
    { day: 'T4', calories: 1750, goal: 2000 },
    { day: 'T5', calories: 1900, goal: 2000 },
    { day: 'T6', calories: 2200, goal: 2000 },
    { day: 'T7', calories: 1650, goal: 2000 },
    { day: 'CN', calories: 1450, goal: 2000 },
];

// =========== FOOD DATABASE ===========
export interface FoodItem {
    id: string;
    name: string;
    category: 'main' | 'protein' | 'fruit' | 'vegetable' | 'snack' | 'drink';
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    serving: string;
    icon: string;
    isSaved?: boolean;
}

export const MOCK_FOOD_DATABASE: FoodItem[] = [
    { id: 'f001', name: 'Phở bò', category: 'main', calories: 450, protein: 25, carbs: 60, fat: 12, serving: '1 tô (400g)', icon: '🍜' },
    { id: 'f002', name: 'Cơm tấm sườn', category: 'main', calories: 680, protein: 35, carbs: 75, fat: 25, serving: '1 đĩa', icon: '🍚' },
    { id: 'f003', name: 'Ức gà nướng', category: 'protein', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g', icon: '🍗' },
    { id: 'f004', name: 'Trứng luộc', category: 'protein', calories: 78, protein: 6, carbs: 0.6, fat: 5, serving: '1 quả', icon: '🥚' },
    { id: 'f005', name: 'Táo', category: 'fruit', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, serving: '1 quả (150g)', icon: '🍎' },
    { id: 'f006', name: 'Chuối', category: 'fruit', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, serving: '1 quả', icon: '🍌' },
    { id: 'f007', name: 'Salad rau xanh', category: 'vegetable', calories: 35, protein: 2, carbs: 7, fat: 0.3, serving: '1 bát', icon: '🥗' },
    { id: 'f008', name: 'Bánh mì thịt', category: 'main', calories: 320, protein: 15, carbs: 45, fat: 10, serving: '1 ổ', icon: '🥖' },
    { id: 'f009', name: 'Sữa tươi', category: 'drink', calories: 62, protein: 3.4, carbs: 5, fat: 3.3, serving: '200ml', icon: '🥛' },
    { id: 'f010', name: 'Hạt hạnh nhân', category: 'snack', calories: 164, protein: 6, carbs: 6, fat: 14, serving: '28g', icon: '🥜', isSaved: true },
];

// =========== CHAT HISTORY ===========
export interface ChatMessage {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
}

export const MOCK_CHAT_HISTORY: ChatMessage[] = [
    { id: 'c001', role: 'ai', content: 'Xin chào! Tôi là AI Health Coach. Tôi có thể giúp bạn lên kế hoạch dinh dưỡng và trả lời các câu hỏi về sức khỏe. Bạn muốn hỏi gì hôm nay?', timestamp: '09:00' },
    { id: 'c002', role: 'user', content: 'Tôi muốn giảm cân, nên ăn gì buổi sáng?', timestamp: '09:01' },
    { id: 'c003', role: 'ai', content: 'Để giảm cân hiệu quả, bữa sáng nên giàu protein và chất xơ. Gợi ý:\n\n🥚 2 quả trứng luộc (156 kcal)\n🍞 1 lát bánh mì đen (80 kcal)\n🥑 1/2 quả bơ (80 kcal)\n🥛 1 ly sữa không đường (60 kcal)\n\nTổng: ~376 kcal - Giúp no lâu và ổn định đường huyết!', timestamp: '09:02' },
];

// =========== DIARY LOG ===========
export interface DiaryEntry {
    id: string;
    date: string;
    meals: {
        breakfast: { items: { name: string; calories: number; time: string }[] };
        lunch: { items: { name: string; calories: number; time: string }[] };
        dinner: { items: { name: string; calories: number; time: string }[] };
        snack: { items: { name: string; calories: number; time: string }[] };
    };
    totalCalories: number;
}

export const MOCK_DIARY_LOG: DiaryEntry[] = [
    {
        id: 'd001',
        date: new Date().toISOString().split('T')[0],
        meals: {
            breakfast: { items: [{ name: 'Phở bò', calories: 450, time: '07:30' }] },
            lunch: { items: [{ name: 'Cơm gà xối mỡ', calories: 650, time: '12:00' }] },
            dinner: { items: [{ name: 'Canh chua cá lóc', calories: 380, time: '19:00' }] },
            snack: { items: [{ name: 'Trái cây hỗn hợp', calories: 120, time: '15:30' }] },
        },
        totalCalories: 1600,
    },
];

// AI Response templates
export const AI_RESPONSES = [
    'Đó là một câu hỏi hay! Dựa trên mục tiêu giảm cân của bạn, tôi khuyên bạn nên...',
    'Tôi hiểu. Để đạt được mục tiêu của bạn, hãy thử những tips sau...',
    'Dựa trên dữ liệu dinh dưỡng của bạn hôm nay, bạn đang làm rất tốt! Hãy tiếp tục...',
    'Đây là một số gợi ý dành riêng cho bạn dựa trên lịch sử ăn uống...',
];

// =========== ADMIN DASHBOARD DATA ===========

export const MOCK_ADMIN_STATS = {
    totalUsers: 1247,
    activeToday: 89,
    totalFoods: 156,
    newReports: 3,
};

export type UserStatus = 'active' | 'banned' | 'pending';
export type UserRole = 'user' | 'admin' | 'moderator';

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    joinDate: string;
    avatar?: string;
}

export const MOCK_USERS_LIST: AdminUser[] = [
    { id: 'u001', name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', role: 'user', status: 'active', joinDate: '2024-12-15' },
    { id: 'u002', name: 'Trần Thị B', email: 'tranthib@gmail.com', role: 'user', status: 'active', joinDate: '2024-12-18' },
    { id: 'u003', name: 'Lê Văn C', email: 'levanc@gmail.com', role: 'moderator', status: 'active', joinDate: '2024-11-20' },
    { id: 'u004', name: 'Phạm Thị D', email: 'phamthid@gmail.com', role: 'user', status: 'banned', joinDate: '2024-10-05' },
    { id: 'u005', name: 'Hoàng Văn E', email: 'hoangvane@gmail.com', role: 'user', status: 'active', joinDate: '2025-01-02' },
    { id: 'u006', name: 'Đặng Thị F', email: 'dangthif@gmail.com', role: 'user', status: 'pending', joinDate: '2025-01-05' },
    { id: 'u007', name: 'Bùi Văn G', email: 'buivang@gmail.com', role: 'admin', status: 'active', joinDate: '2024-08-10' },
    { id: 'u008', name: 'Vũ Thị H', email: 'vuthih@gmail.com', role: 'user', status: 'active', joinDate: '2024-12-28' },
    { id: 'u009', name: 'Ngô Văn I', email: 'ngovani@gmail.com', role: 'user', status: 'banned', joinDate: '2024-09-15' },
    { id: 'u010', name: 'Dương Thị K', email: 'duongthik@gmail.com', role: 'user', status: 'active', joinDate: '2025-01-06' },
];

export interface RecentActivity {
    id: string;
    type: 'user_register' | 'food_added' | 'report_created' | 'user_banned';
    description: string;
    timestamp: string;
    user?: string;
}

export const MOCK_RECENT_ACTIVITIES: RecentActivity[] = [
    { id: 'a001', type: 'user_register', description: 'Người dùng mới đăng ký', timestamp: '5 phút trước', user: 'Dương Thị K' },
    { id: 'a002', type: 'food_added', description: 'Thêm món ăn mới: Bún chả Hà Nội', timestamp: '15 phút trước', user: 'Admin' },
    { id: 'a003', type: 'report_created', description: 'Báo cáo vi phạm nội dung', timestamp: '1 giờ trước', user: 'Nguyễn Văn A' },
    { id: 'a004', type: 'user_banned', description: 'Khóa tài khoản vi phạm', timestamp: '2 giờ trước', user: 'Phạm Thị D' },
    { id: 'a005', type: 'user_register', description: 'Người dùng mới đăng ký', timestamp: '3 giờ trước', user: 'Đặng Thị F' },
];

export const MOCK_REGISTRATION_CHART = [
    { day: 'T2', users: 12 },
    { day: 'T3', users: 19 },
    { day: 'T4', users: 8 },
    { day: 'T5', users: 15 },
    { day: 'T6', users: 22 },
    { day: 'T7', users: 28 },
    { day: 'CN', users: 18 },
];
