import { Metadata } from 'next';
import UsersClient from './UsersClient';

export const metadata: Metadata = {
    title: 'Quản lý người dùng - Quản trị viên',
    description: 'Quản lý danh sách thành viên hệ thống',
};

export default function AdminUsersPage() {
    return <UsersClient />;
}
