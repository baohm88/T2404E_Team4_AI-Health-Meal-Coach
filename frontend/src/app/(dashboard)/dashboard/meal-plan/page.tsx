import { Metadata } from 'next';
import MealPlanClient from './MealPlanClient';

export const metadata: Metadata = {
    title: 'Kế hoạch ăn uống - AI Health Coach',
    description: 'Xem và quản lý thực đơn dinh dưỡng hàng ngày',
};

export default function MealPlanPage() {
    return <MealPlanClient />;
}
