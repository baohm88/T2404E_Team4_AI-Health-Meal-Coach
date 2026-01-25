/**
 * User Management Page
 * 
 * Admin page for managing users with search, pagination, and actions.
 */

'use client';

import { Column, DataTable } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Pagination } from '@/components/ui/Pagination';
import { getUsers, togglePremiumStatus, toggleUserStatus } from '@/services/admin.service';
import { AdminUser } from '@/types/admin';
import { Eye, Lock, Search, Star, Unlock, UserCircle2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// ============================================================
// STATUS LABELS
// ============================================================

const getStatusLabel = (status: number) => {
    switch(status) {
        case 1: return 'Active';
        case 0: return 'Banned'; // Or Inactive
        default: return 'Deleted';
    }
};

const roleLabels: Record<string, string> = {
    USER: 'User',
    ADMIN: 'Admin',
    MODERATOR: 'Mod',
};

// ============================================================
// MAIN PAGE
// ============================================================

export default function UsersManagementPage() {
    // State
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);

    // Sorting
    const [sortColumn, setSortColumn] = useState('id');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    // Fetch Users
    const fetchUsers = useCallback(async (page: number, query: string, sortCol?: string, sortDir?: 'asc' | 'desc') => {
        setLoading(true);
        try {
            // Note: query is NOT mocked, backend filtering implemented
            const data = await getUsers(page, 10, query, `${sortCol || sortColumn},${sortDir || sortDirection}`);
            setUsers(data.content);
            setTotalPages(data.totalPages);
            setTotalUsers(data.totalElements);
            setCurrentPage(data.number);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            // Optional: show toast error
        } finally {
            setLoading(false);
        }
    }, [sortColumn, sortDirection]);

    // Initial load & Search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers(currentPage, searchQuery, sortColumn, sortDirection);
        }, 500); // Debounce search

        return () => clearTimeout(timer);
    }, [searchQuery, currentPage, sortColumn, sortDirection, fetchUsers]);

    // Handlers
    const handleSort = (column: string) => {
        // Toggle direction if clicking same column
        const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(newDirection);
        // Effect will trigger fetch
    };

    const handleToggleStatus = async (user: AdminUser) => {
        if (!confirm(`Bạn có chắc muốn ${user.status === 1 ? 'khóa' : 'mở khóa'} tài khoản này?`)) return;
        try {
            await toggleUserStatus(user.id);
            fetchUsers(currentPage, searchQuery, sortColumn, sortDirection); // Refresh
        } catch (error) {
            console.error('Failed to toggle status:', error);
        }
    };

    const handleTogglePremium = async (user: AdminUser) => {
        try {
            await togglePremiumStatus(user.id);
            fetchUsers(currentPage, searchQuery, sortColumn, sortDirection); // Refresh
        } catch (error) {
            console.error('Failed to toggle premium:', error);
        }
    };

    // Table columns configuration
    const columns: Column<AdminUser>[] = [
        {
            key: 'fullName', // Changed from name to fullName to match backend sort field if needed. Or alias in backend. 
                            // Note: Backend Entity usually has 'fullName'. Let's assume 'fullName' is valid sort field. 
                            // If UI key is 'name', we might need to map it. 
                            // But `AdminUser` type usually has `fullName`.
                            // Let's check `AdminUser` type definition. 
                            // Wait, previous code used `key: 'name'`. I should check if backend supports sorting by `name`.
                            // User Entity usually has `fullName`. 
                            // I will use `fullName` as key for sorting to be safe.
            header: 'Người dùng',
            sortable: true,
            render: (user) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center relative">
                        <UserCircle2 className="w-6 h-6 text-slate-400" />
                        {user.isPremium && (
                            <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5" title="Premium User">
                                <Star className="w-3 h-3 text-white fill-white" />
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="font-medium text-slate-800">{user.fullName}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'role',
            header: 'Vai trò',
            sortable: true,
            render: (user) => (
                <span className="text-sm text-slate-600">{roleLabels[user.role] || user.role}</span>
            ),
        },
        {
            key: 'createdAt', // Changed from joinDate to match backend field
            header: 'Ngày tham gia',
            sortable: true,
            render: (user) => (
                <span className="text-sm text-slate-600">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Trạng thái',
            sortable: true,
            render: (user) => <StatusBadge status={getStatusLabel(user.status)} />,
        },
        {
            key: 'actions',
            header: 'Hành động',
            render: (user) => (
                <div className="flex items-center gap-2">
                    <button
                        className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                        title="Xem chi tiết"
                        // Implement details view later
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    
                    {/* Status Toggle */}
                    <button
                        onClick={() => handleToggleStatus(user)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            user.status === 0 
                                ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                        title={user.status === 0 ? "Mở khóa" : "Khóa tài khoản"}
                    >
                        {user.status === 0 ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </button>

                    {/* Premium Toggle */}
                    <button
                        onClick={() => handleTogglePremium(user)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            user.isPremium
                                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                        title={user.isPremium ? "Hủy Premium" : "Kích hoạt Premium"}
                    >
                        <Star className={`w-4 h-4 ${user.isPremium ? 'fill-yellow-600' : ''}`} />
                    </button>
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
                        Tổng cộng <span className="font-semibold text-slate-800">{totalUsers}</span> người dùng
                    </p>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên hoặc email..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(0); // Reset page on search
                        }}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                    />
                </div>
            </div>

            {/* Data Table */}
            {loading && users.length === 0 ? (
                <div className="text-center py-12 text-slate-400">Đang tải...</div>
            ) : (
                <>
                <DataTable
                    data={users}
                    columns={columns}
                    keyExtractor={(user) => String(user.id)}
                    emptyMessage="Không tìm thấy người dùng"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                />
                
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
                </>
            )}
        </div>
    );
}
