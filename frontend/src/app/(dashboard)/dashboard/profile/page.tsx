import { Metadata } from 'next';
import ProfileClient from './ProfileClient';

export const metadata: Metadata = {
    title: 'Hồ sơ sức khỏe - AI Health Coach',
    description: 'Quản lý thông tin cá nhân và chỉ số sức khỏe',
};

export default function ProfilePage() {
    return <ProfileClient />;
}
