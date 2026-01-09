'use client';

import { motion } from 'framer-motion';
import { Utensils, Target, Heart, Zap } from 'lucide-react';

const features = [
    {
        icon: Utensils,
        title: 'Personalized Meal Plans',
        description: 'AI-generated meal plans tailored to your dietary preferences and health goals.',
    },
    {
        icon: Target,
        title: 'Calorie Tracking',
        description: 'Easily log your meals and track your daily calorie intake with our smart food database.',
    },
    {
        icon: Heart,
        title: 'Health Insights',
        description: 'Get detailed nutritional insights and recommendations to improve your diet.',
    },
    {
        icon: Zap,
        title: 'Quick Recipes',
        description: 'Access hundreds of healthy Vietnamese recipes that fit your lifestyle.',
    },
];

export function Features() {
    return (
        <section id="features" className="py-20 md:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-serif text-4xl md:text-5xl font-semibold text-slate-900 mb-4">
                        Supporting your health and<br />wellness goals at every stage
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Everything you need to build lasting healthy habits
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="text-center p-6"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                                    <Icon className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
