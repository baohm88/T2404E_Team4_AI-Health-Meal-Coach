'use client';

import { motion } from 'framer-motion';

export function TrustBanner() {
    return (
        <section className="py-12 bg-white border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <p className="text-slate-500 text-sm uppercase tracking-widest mb-2">
                        Trusted by health-conscious users
                    </p>
                    <p className="font-serif text-2xl md:text-3xl text-slate-900 font-medium">
                        Join 10,000+ users on their health journey
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
