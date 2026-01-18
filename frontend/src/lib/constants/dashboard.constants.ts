/**
 * Dashboard Constants
 * Centralized configuration for dashboard module
 */

import { Home, CalendarDays, BookOpen, Utensils, Bot, User, LucideIcon } from 'lucide-react';

// ============================================================
// NAVIGATION
// ============================================================

/** Dashboard route paths */
export const DASHBOARD_ROUTES = {
    HOME: '/dashboard',
    SCHEDULE: '/dashboard/schedule',
    DIARY: '/dashboard/diary',
    FOODS: '/dashboard/foods',
    AI_COACH: '/dashboard/ai-coach',
    PROFILE: '/dashboard/profile',
} as const;

/** Menu item type */
export interface MenuItem {
    href: string;
    icon: LucideIcon;
    label: string;
}

/** Dashboard navigation menu items */
export const DASHBOARD_MENU_ITEMS: MenuItem[] = [
    { href: DASHBOARD_ROUTES.HOME, icon: Home, label: 'Tổng quan' },
    { href: DASHBOARD_ROUTES.SCHEDULE, icon: CalendarDays, label: 'Lịch ăn' },
    { href: DASHBOARD_ROUTES.DIARY, icon: BookOpen, label: 'Nhật ký' },
    { href: DASHBOARD_ROUTES.FOODS, icon: Utensils, label: 'Món ăn' },
    { href: DASHBOARD_ROUTES.AI_COACH, icon: Bot, label: 'AI Coach' },
    { href: DASHBOARD_ROUTES.PROFILE, icon: User, label: 'Hồ sơ' },
];

// ============================================================
// BRANDING
// ============================================================

export const BRAND = {
    NAME: 'AI Health Coach',
    SHORT_NAME: 'AI',
    COPYRIGHT: '© 2024 AI Health Coach',
} as const;

// ============================================================
// LAYOUT
// ============================================================

export const LAYOUT = {
    SIDEBAR_WIDTH: 'w-64',
    SIDEBAR_WIDTH_PX: 256,
    MOBILE_NAV_HEIGHT: 'h-20',
    MOBILE_NAV_HEIGHT_PX: 80,
} as const;
