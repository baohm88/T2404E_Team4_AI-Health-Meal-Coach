'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ZigZagSectionProps {
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    reversed?: boolean;
    badge?: string;
    children?: ReactNode;
}

export function ZigZagSection({
    title,
    description,
    imageSrc,
    imageAlt,
    reversed = false,
    badge,
    children,
}: ZigZagSectionProps) {
    return (
        <section className="py-20 md:py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center ${reversed ? 'md:flex-row-reverse' : ''
                    }`}>
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: reversed ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className={`relative ${reversed ? 'md:order-2' : 'md:order-1'}`}
                    >
                        <div className="relative aspect-[4/5] max-w-md mx-auto">
                            {/* Decorative background */}
                            <div className="absolute -inset-4 bg-cream-dark rounded-[3rem] -z-10" />

                            {/* Image */}
                            <div className="relative h-full w-full rounded-[2rem] overflow-hidden">
                                <Image
                                    src={imageSrc}
                                    alt={imageAlt}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: reversed ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                        className={`${reversed ? 'md:order-1' : 'md:order-2'}`}
                    >
                        {badge && (
                            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                                {badge}
                            </span>
                        )}

                        <h2 className="font-serif text-4xl md:text-5xl font-semibold text-slate-900 leading-tight mb-6">
                            {title}
                        </h2>

                        <p className="text-lg text-slate-600 leading-relaxed mb-8">
                            {description}
                        </p>

                        {children}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
