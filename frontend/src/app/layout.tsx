import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { ReactNode } from 'react';

const inter = Inter({
    subsets: ['latin', 'vietnamese'],
    variable: '--font-inter',
    display: 'swap',
});

export const metadata = {
    title: 'AI Health Coach - Sống khỏe hơn mỗi ngày',
    description: 'Kế hoạch ăn uống và tập luyện cá nhân hóa với trợ lý AI thông minh.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="vi" className={inter.variable}>
            <body className="font-sans antialiased">
                {children}
                <Toaster position="top-right" richColors closeButton />
            </body>
        </html>
    );
}
