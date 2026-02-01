import { Metadata } from 'next';
import FoodsClient from './FoodsClient';

export const metadata: Metadata = {
    title: 'Quản lý món ăn - Quản trị viên',
    description: 'Thư viện dinh dưỡng và món ăn hệ thống',
};

export default function AdminFoodsPage() {
    return <FoodsClient />;
}
