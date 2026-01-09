/**
 * Admin Dashboard Constants
 * 
 * Menu items and brand info for Admin Portal.
 */

import { LayoutDashboard, Users, Database, Flag, LucideIcon } from 'lucide-react';

// ============================================================
// TYPES
// ============================================================

export interface AdminMenuItem {
    href: string;
    label: string;
    icon: LucideIcon;
    description?: string;
}

// ============================================================
// ADMIN MENU ITEMS
// ============================================================

export const ADMIN_MENU_ITEMS: AdminMenuItem[] = [
    {
        href: '/admin',
        label: 'Tổng quan',
        icon: LayoutDashboard,
        description: 'Dashboard Overview',
    },
    {
        href: '/admin/users',
        label: 'Người dùng',
        icon: Users,
        description: 'User Management',
    },
    {
        href: '/admin/foods',
        label: 'Kho món ăn',
        icon: Database,
        description: 'Food Database',
    },
    {
        href: '/admin/reports',
        label: 'Báo cáo',
        icon: Flag,
        description: 'Reports',
    },
];

// ============================================================
// BRAND INFO
// ============================================================

export const ADMIN_BRAND = {
    NAME: 'Admin Portal',
    SHORT_NAME: 'AD',
    COPYRIGHT: '© 2025 AI Health Coach Admin',
};
