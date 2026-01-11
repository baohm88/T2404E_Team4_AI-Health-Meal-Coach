/**
 * User Management Page
 * 
 * Admin page for managing users with search, filter, and actions.
 */

'use client';

import { useState, useMemo } from 'react';
import { Search, Lock, Unlock, Eye, UserCircle2 } from 'lucide-react';
import { MOCK_USERS_LIST, AdminUser } from '@/lib/mock-data';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';

// ============================================================
// STATUS LABELS
// ============================================================

const statusLabels: Record<AdminUser['status'], string> = {
    active: 'Active',
    banned: 'Banned',
    pending: 'Pending',
};

const roleLabels: Record<AdminUser['role'], string> = {
    user: 'User',
    admin: 'Admin',
    moderator: 'Mod',
};

// ============================================================
// MAIN PAGE
// ============================================================

export default function UsersManagementPage() {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter users based on search query
    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) return MOCK_USERS_LIST;
        const query = searchQuery.toLowerCase();
        return MOCK_USERS_LIST.filter(
            (user) =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    // Table columns configuration
    const columns: Column<AdminUser>[] = [
        {
            key: 'name',
            header: 'Người dùng',
            render: (user) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <UserCircle2 className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                        <p className="font-medium text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'role',
            header: 'Vai trò',
            render: (user) => (
                <span className="text-sm text-slate-600">{roleLabels[user.role]}</span>
            ),
        },
        {
            key: 'joinDate',
            header: 'Ngày tham gia',
            render: (user) => (
                <span className="text-sm text-slate-600">
                    {new Date(user.joinDate).toLocaleDateString('vi-VN')}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Trạng thái',
            render: (user) => <StatusBadge status={statusLabels[user.status]} />,
        },
        {
            key: 'actions',
            header: 'Hành động',
            render: (user) => (
                <div className="flex items-center gap-2">
                    <button
                        className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                        title="Xem chi tiết"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    {user.status === 'banned' ? (
                        <button
                            className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 hover:bg-green-200 transition-colors"
                            title="Mở khóa"
                        >
                            <Unlock className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 hover:bg-red-200 transition-colors"
                            title="Khóa tài khoản"
                        >
                            <Lock className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header with Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <p className="text-slate-500">
                        Tổng cộng <span className="font-semibold text-slate-800">{MOCK_USERS_LIST.length}</span> người dùng
                    </p>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên hoặc email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                    />
                </div>
            </div>

            {/* Data Table */}
            <DataTable
                data={filteredUsers}
                columns={columns}
                keyExtractor={(user) => user.id}
                emptyMessage="Không tìm thấy người dùng"
            />
        </div>
    );
}
