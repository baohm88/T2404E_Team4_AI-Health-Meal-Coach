'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="py-16 bg-cream-dark border-t border-slate-200/50">
            <div className="max-w-7xl mx-auto px-6">
                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
                        Healthy eating,<br />simplified.
                    </h2>
                    <Link
                        href="/onboarding"
                        className="inline-flex items-center justify-center px-8 py-4 mt-6 rounded-full bg-primary text-white font-semibold text-lg hover:bg-green-600 transition-all"
                    >
                        Get Started Free
                    </Link>
                </motion.div>

                {/* Footer Links */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-200">
                    <div className="text-slate-900 font-bold text-lg">
                        AI Health Coach
                    </div>

                    <div className="flex gap-8 text-sm text-slate-600">
                        <Link href="#" className="hover:text-slate-900 transition-colors">Điều khoản</Link>
                        <Link href="#" className="hover:text-slate-900 transition-colors">Bảo mật</Link>
                        <Link href="#" className="hover:text-slate-900 transition-colors">Liên hệ</Link>
                    </div>

                    <div className="text-sm text-slate-500">
                        © 2024 AI Health Coach
                    </div>
                </div>
            </div>
        </footer>
    );
}
