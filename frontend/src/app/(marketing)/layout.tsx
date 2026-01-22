/**
 * Marketing Layout
 * 
 * Layout wrapper for all public marketing pages (landing, about, contact, etc.)
 * Provides consistent header and footer across all marketing pages.
 */

import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <MarketingHeader />
            <main className="flex-1">{children}</main>
            <MarketingFooter />
        </div>
    );
}
