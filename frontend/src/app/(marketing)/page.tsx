/**
 * Marketing Landing Page
 * 
 * Main landing page with hero, features, and how-it-works sections
 * Route: / (within marketing route group)
 */

'use client';

import { Hero } from '@/components/landing/Hero';
import { ZigZagSection } from '@/components/landing/ZigZagSection';
import { Features } from '@/components/landing/Features';
import { TrustBanner } from '@/components/landing/TrustBanner';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { QuickLinks } from '@/components/marketing/QuickLinks';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - overlaps navbar */}
            <Hero />

            {/* Quick Links - Navigation below hero */}
            <QuickLinks />

            {/* Section 1: Eat well. Live well. */}
            <ZigZagSection
                title="Eat well. Live well."
                description="Track your calories and macros effortlessly with our intelligent food database. Our AI learns your preferences and makes logging meals as simple as a single tap."
                imageSrc="/assets/mockup-phone.png"
                imageAlt="App Mockup - Calorie Tracking"
                badge="Smart Tracking"
            >
                <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
                        Auto-detect meals
                    </span>
                    <span className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
                        Barcode scanner
                    </span>
                    <span className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
                        Vietnamese foods
                    </span>
                </div>
            </ZigZagSection>

            {/* Section 2: Find a diet you love (Reversed) */}
            <ZigZagSection
                title="Find a diet that fits your life."
                description="Whether you're into Keto, Mediterranean, Clean Eating, or traditional Vietnamese cuisine, our AI will create a personalized plan that you'll actually enjoy following."
                imageSrc="/assets/diet-plans.png"
                imageAlt="Diet Plans - Various cuisines"
                reversed
                badge="Personalized"
            >
                <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        Keto
                    </span>
                    <span className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        Clean Eating
                    </span>
                    <span className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        Low Carb
                    </span>
                    <span className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        Vietnamese
                    </span>
                </div>
            </ZigZagSection>

            {/* Trust Banner */}
            <TrustBanner />

            {/* How It Works Section */}
            <HowItWorks />

            {/* Section 3: Recipes */}
            <ZigZagSection
                title="Recipes for every occasion."
                description="Discover hundreds of delicious, healthy recipes tailored to your goals. From quick weeknight dinners to special weekend meals, we've got you covered."
                imageSrc="/assets/mockup-phone.png"
                imageAlt="Healthy Recipes"
                badge="500+ Recipes"
            >
                <Link
                    href="/onboarding"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all"
                >
                    Explore Recipes
                </Link>
            </ZigZagSection>

            {/* Features Grid */}
            <Features />
        </div>
    );
}
