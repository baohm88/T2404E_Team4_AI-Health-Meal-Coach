# 📚 Mock Services Usage Guide

## Quick Start

Toggle mock data mode in services:
```typescript
const USE_MOCK_DATA = true;  // Change to false when backend is ready
```

---

## Example 1: Dashboard - Health Analysis

```typescript
'use client';

import { useEffect, useState } from 'react';
import { healthService, HealthAnalysis } from '@/services/health.service';

export default function DashboardPage() {
    const [healthData, setHealthData] = useState<HealthAnalysis | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHealthData = async () => {
            setLoading(true);
            const result = await healthService.getHealthAnalysis();
            
            if (result.success && result.data) {
                setHealthData(result.data);
            }
            
            setLoading(false);
        };

        fetchHealthData();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Dashboard</h1>
            <p>BMI: {healthData?.bmi}</p>
            <p>BMR: {healthData?.bmr} kcal</p>
            <p>TDEE: {healthData?.tdee} kcal</p>
            <p>Lời khuyên: {healthData?.advice}</p>
        </div>
    );
}
```

---

## Example 2: Pricing Page - Subscription Plans

```typescript
'use client';

import { useEffect, useState } from 'react';
import { subscriptionService, SubscriptionPlan } from '@/services/subscription.service';

export default function PricingPage() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

    useEffect(() => {
        const fetchPlans = async () => {
            const result = await subscriptionService.getAvailablePlans();
            if (result.success && result.data) {
                setPlans(result.data);
            }
        };

        fetchPlans();
    }, []);

    return (
        <div className="grid grid-cols-3 gap-4">
            {plans.map((plan) => (
                <div key={plan.tier} className="border p-4">
                    <h3>{plan.name}</h3>
                    <p>{plan.price.toLocaleString('vi-VN')} VND</p>
                    <ul>
                        {plan.features.map((feature, i) => (
                            <li key={i}>{feature}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}
```

---

## Example 3: Premium Gate Check

```typescript
'use client';

import { useEffect, useState } from 'react';
import { subscriptionService } from '@/services/subscription.service';

export default function SchedulePage() {
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        const checkPremium = async () => {
            const premium = await subscriptionService.isPremium();
            setIsPremium(premium);
        };

        checkPremium();
    }, []);

    if (!isPremium) {
        return <div>Nâng cấp Premium để xem tính năng này</div>;
    }

    return <div>Premium content here</div>;
}
```

---

## Switching to Real API

**Step 1:** Open service files and toggle flag
```typescript
// src/services/health.service.ts
const USE_MOCK_DATA = false;  // ✅ Switch to real API

// src/services/subscription.service.ts
const USE_MOCK_DATA = false;  // ✅ Switch to real API
```

**Step 2:** Ensure backend has these endpoints
- `GET /health/analysis`
- `GET /health/profile`
- `GET /subscription/status`
- `GET /subscription/plans`

**Step 3:** Test in DevTools (F12 → Network tab)

---

## Available Services

### healthService
- `getHealthAnalysis()` - Get BMI, BMR, TDEE, health advice
- `getHealthProfile()` - Get user's health profile

### subscriptionService
- `getSubscriptionStatus()` - Get current subscription
- `getAvailablePlans()` - Get Premium plans
- `isPremium()` - Helper to check if user has Premium
