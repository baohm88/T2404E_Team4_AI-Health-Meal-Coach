'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Bookmark, ChefHat } from 'lucide-react';
import { foodService } from '@/services/food.service';
import { FoodItem } from '@/lib/mock-data';

const tabs = [
    { id: 'all', label: 'Món ăn', icon: null },
    { id: 'saved', label: 'Đã lưu', icon: Bookmark },
    { id: 'custom', label: 'Tự nấu', icon: ChefHat },
];

export default function FoodsPage() {
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    const loadFoods = useCallback(async (tab: string, query: string) => {
        setIsLoading(true);
        let result: FoodItem[];

        if (query.trim()) {
            result = await foodService.searchFood(query);
        } else if (tab === 'saved') {
            result = await foodService.getSavedFoods();
        } else {
            result = await foodService.getAllFoods();
        }

        setFoods(result);
        setIsLoading(false);
    }, []);

    // Load foods on mount and when activeTab changes
    useEffect(() => {
        let isCancelled = false;

        const fetchData = async () => {
            setIsLoading(true);
            let result: FoodItem[];

            if (activeTab === 'saved') {
                result = await foodService.getSavedFoods();
            } else {
                result = await foodService.getAllFoods();
            }

            if (!isCancelled) {
                setFoods(result);
                setIsLoading(false);
            }
        };

        fetchData();

        return () => {
            isCancelled = true;
        };
    }, [activeTab]);

    // Debounced search
    useEffect(() => {
        if (!searchQuery.trim()) return;

        const timer = setTimeout(() => {
            loadFoods(activeTab, searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, activeTab, loadFoods]);

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm món ăn..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-0 shadow-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-white rounded-2xl p-1.5 shadow-sm">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${activeTab === tab.id
                                ? 'bg-primary text-white'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        {tab.icon && <tab.icon className="w-4 h-4" />}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Food List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : foods.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center shadow-sm">
                    <p className="text-slate-500">Không tìm thấy món ăn nào.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {foods.map((food) => (
                        <div
                            key={food.id}
                            className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-all cursor-pointer"
                        >
                            {/* Icon */}
                            <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-3xl">
                                {food.icon}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <h3 className="font-semibold text-slate-800">{food.name}</h3>
                                <p className="text-sm text-slate-500">
                                    {food.calories} kcal • {food.serving}
                                </p>
                                <div className="flex gap-3 mt-1 text-xs text-slate-400">
                                    <span>P: {food.protein}g</span>
                                    <span>C: {food.carbs}g</span>
                                    <span>F: {food.fat}g</span>
                                </div>
                            </div>

                            {/* Add Button */}
                            <button className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Floating Action Button */}
            <button className="fixed bottom-24 lg:bottom-8 right-6 w-14 h-14 rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 transition-transform">
                <Plus className="w-6 h-6" />
            </button>
        </div>
    );
}
