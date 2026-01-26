import { jwtDecode } from 'jwt-decode';

export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

export interface JwtPayload {
    sub: string;
    userId: number;
    role: string;
    iat: number;
    exp: number;
}

/**
 * Decode JWT token to get user info
 */
export const decodeToken = (token: string): JwtPayload | null => {
    try {
        return jwtDecode<JwtPayload>(token);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

/**
 * Get user role from token
 */
export const getUserRole = (token: string): UserRole | null => {
    const payload = decodeToken(token);
    if (!payload?.role) return null;
    
    // Normalize casing just in case (e.g. "Admin" vs "ADMIN")
    const role = payload.role.toUpperCase();
    
    if (role === UserRole.ADMIN) return UserRole.ADMIN;
    return UserRole.USER;
};

/**
 * Check if user is Admin
 */
export const isAdmin = (token: string): boolean => {
    return getUserRole(token) === UserRole.ADMIN;
};
