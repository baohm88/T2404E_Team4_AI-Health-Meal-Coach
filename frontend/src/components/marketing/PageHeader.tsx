/**
 * Page Header Component
 * 
 * Reusable header for marketing pages
 */

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    gradient?: boolean;
}

export function PageHeader({ title, subtitle, gradient = false }: PageHeaderProps) {
    return (
        <div
            className={`relative py-16 md:py-20 ${gradient
                    ? 'bg-gradient-to-br from-emerald-50 via-white to-green-50'
                    : 'bg-slate-50'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}
