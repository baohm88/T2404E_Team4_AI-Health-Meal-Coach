/**
 * Admin Dashboard Constants
 * 
 * Menu items and brand info for Admin Portal.
 */

import { LayoutDashboard, Users, Database, Flag, Settings, Bot, FileText, LucideIcon, Settings2 } from 'lucide-react';

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
    {
        href: '/admin/ai-config',
        label: 'Cấu hình AI',
        icon: Bot,
        description: 'AI System Configuration',
    },
    {
        href: '/admin/logs',
        label: 'Nhật ký hệ thống',
        icon: FileText,
        description: 'System Logs & Activity',
    },
    {
        href: '/admin/settings',
        label: 'Cài đặt',
        icon: Settings2,
        description: 'Global Settings',
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
