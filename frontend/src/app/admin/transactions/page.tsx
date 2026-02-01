import { Metadata } from 'next';
import TransactionsClient from './TransactionsClient';

export const metadata: Metadata = {
    title: 'Lịch sử giao dịch - Quản trị viên',
    description: 'Theo dõi dòng tiền và lịch sử thanh toán',
};

export default function AdminTransactionsPage() {
    return <TransactionsClient />;
}
