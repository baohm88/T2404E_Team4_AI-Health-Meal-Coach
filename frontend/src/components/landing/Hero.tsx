'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-cream/95 via-cream/80 to-transparent z-10" />
                <Image
                    src="/assets/hero-healthy-eating.png"
                    alt="Healthy eating"
                    fill
                    className="object-cover object-right"
                    priority
                />
            </div>

            {/* Content */}
            <div className="relative z-20 max-w-7xl mx-auto px-6 py-20">
                <div className="max-w-2xl">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-primary font-semibold text-sm uppercase tracking-widest mb-4"
                    >
                        AI-Powered Nutrition
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="font-serif text-5xl md:text-7xl font-semibold text-slate-900 leading-[1.1] mb-6"
                    >
                        Healthy eating,<br />
                        simplified with AI
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-600 mb-10 max-w-lg"
                    >
                        Get personalized meal plans, track your nutrition, and achieve your health goals with our intelligent AI coach.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Link
                            href="/onboarding"
                            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-white font-semibold text-lg hover:bg-green-600 transition-all shadow-lg shadow-primary/30 hover:shadow-xl"
                        >
                            Start Now — It&apos;s Free
                        </Link>
                        <Link
                            href="#features"
                            className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-slate-300 text-slate-700 font-semibold text-lg hover:border-slate-400 transition-all"
                        >
                            Learn More
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
            >
                <div className="w-6 h-10 rounded-full border-2 border-slate-400 flex items-start justify-center p-2">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-slate-400"
                    />
                </div>
            </motion.div>
        </section>
    );
}
