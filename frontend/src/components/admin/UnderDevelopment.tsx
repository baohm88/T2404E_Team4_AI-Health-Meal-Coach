'use client';

import { Construction, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface UnderDevelopmentProps {
    title: string;
    description?: string;
}

export function UnderDevelopment({ title, description }: UnderDevelopmentProps) {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="relative bg-slate-900 p-8 rounded-[32px] border border-slate-700 shadow-2xl">
                    <Construction className="w-16 h-16 text-emerald-400" />
                </div>
            </div>

            <div className="text-center space-y-4 max-w-md">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                    {title} <span className="text-emerald-500">đang phát triển</span>
                </h1>
                <p className="text-slate-500 font-medium leading-relaxed">
                    {description || 'Tính năng này hiện đang được chúng tôi hoàn thiện để mang lại trải nghiệm tốt nhất cho bạn. Vui lòng quay lại sau!'}
                </p>
            </div>

            <div className="mt-10">
                <Link href="/admin">
                    <Button className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all hover:scale-105 active:scale-95 gap-2">
                        <LayoutDashboard className="w-4 h-4" /> Quay lại Tổng quan
                    </Button>
                </Link>
            </div>
        </div>
    );
}
