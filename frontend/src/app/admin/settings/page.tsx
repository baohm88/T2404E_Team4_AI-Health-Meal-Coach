import { Metadata } from 'next';
import SettingsClient from './SettingsClient';

export const metadata: Metadata = {
    title: 'Cài đặt hệ thống - Quản trị viên',
    description: 'Cấu hình tham số hệ thống và tích hợp',
};

export default function AdminSettingsPage() {
    return <SettingsClient />;
}
