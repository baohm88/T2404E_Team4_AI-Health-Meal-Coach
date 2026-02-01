import { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
    title: 'Tổng quan - AI Health Coach',
    description: 'Bảng điều khiển sức khỏe cá nhân của bạn',
};

export default function DashboardPage() {
    return <DashboardClient />;
}
