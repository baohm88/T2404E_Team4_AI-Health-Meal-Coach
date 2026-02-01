import { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
    title: 'Tổng quan - Quản trị viên',
    description: 'Bảng điều khiển quản trị viên AI Health Coach',
};

export default function AdminDashboardPage() {
    return <DashboardClient />;
}
