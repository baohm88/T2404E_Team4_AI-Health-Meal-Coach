"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, Upload, Camera, Loader2, CheckCircle2, AlertCircle,
    Mic, MessageSquare, Search, Sparkles, Send, History, ChevronRight
} from "lucide-react";
import { mealLogService } from "@/services/meal-log.service";
import { toast } from "sonner";
import clsx from "clsx";

interface MealLogModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (data: any) => void;
    mealType: string;
    day: number;
    plannedMealId?: number;
}

type LogMode = 'ai-scan' | 'voice' | 'search';

export const MealLogModal: React.FC<MealLogModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    mealType,
    day,
    plannedMealId
}) => {
    const [activeTab, setActiveTab] = useState<LogMode>('ai-scan');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    // AI Scan State
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    // Text & Voice State
    const [inputText, setInputText] = useState("");
    const [isListening, setIsListening] = useState(false);

    // Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const recognitionRef = useRef<any>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Debounced Live Search
    useEffect(() => {
        if (activeTab === 'search') {
            const query = searchQuery.trim();

            // Nếu query trống, hiện toàn bộ món (không cần đợi debounce lâu)
            if (!query) {
                handleSearch();
                return;
            }

            // Nếu có ký tự, debounce 500ms
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(() => {
                handleSearch();
            }, 500);
        }
        return () => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        };
    }, [searchQuery, activeTab]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResult(null);
        }
    };

    const handleAILog = async () => {
        if (!file) return;
        try {
            setLoading(true);
            const res = await mealLogService.analyzeMealImage(file, plannedMealId, mealType);
            if (res.success) {
                setResult(res.data);
                toast.success("AI đã phân tích xong!");
                setTimeout(() => { onSuccess(res.data); handleClose(); }, 2500);
            } else {
                toast.error(res.message || "Không thể phân tích ảnh.");
            }
        } catch (error: any) {
            toast.error("Lỗi kết nối server.");
        } finally {
            setLoading(false);
        }
    };

    const handleVoiceLog = async () => {
        if (!inputText.trim()) return;
        try {
            setLoading(true);
            const res = await mealLogService.analyzeMealText(inputText, plannedMealId, mealType);
            if (res.success) {
                setResult(res.data);
                toast.success("Đã xác nhận món ăn!");
                setTimeout(() => { onSuccess(res.data); handleClose(); }, 2500);
            } else {
                toast.error(res.message || "AI chưa nhận diện được món này.");
            }
        } catch (error: any) {
            toast.error("Lỗi kết nối server.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        const query = searchQuery.trim();
        if (!query) {
            setSearchResults([]);
            setHasSearched(false);
            return;
        }
        try {
            setLoading(true);
            setHasSearched(true);
            const res = await mealLogService.searchDishes(query, mealType);
            if (res.success) {
                setSearchResults(res.data.content);
            }
        } catch (error) {
            toast.error("Lỗi tìm kiếm.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectDish = async (dish: any) => {
        try {
            setLoading(true);
            const checkInData = {
                plannedMealId,
                foodName: dish.name,
                estimatedCalories: dish.baseCalories,
                type: mealType,
                nutritionDetails: dish.description || "Thư viện món ăn"
            };
            const res = await mealLogService.checkInByData(checkInData);
            if (res.success) {
                toast.success(`Đã đổi sang: ${dish.name}`);
                onSuccess({ foodName: dish.name, estimatedCalories: dish.baseCalories });
                handleClose();
            }
        } catch (error) {
            toast.error("Lỗi cập nhật.");
        } finally {
            setLoading(false);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error("Trình duyệt không hỗ trợ nhận diện giọng nói.");
            return;
        }

        try {
            const recognition = new SpeechRecognition();
            recognition.lang = 'vi-VN';
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onstart = () => setIsListening(true);
            recognition.onresult = (event: any) => {
                let currentTranscript = "";
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    currentTranscript += event.results[i][0].transcript;
                }
                if (currentTranscript) setInputText(currentTranscript);
            };
            recognition.onerror = () => setIsListening(false);
            recognition.onend = () => setIsListening(false);

            recognitionRef.current = recognition;
            recognition.start();
        } catch (err) {
            toast.error("Lỗi khởi động microphone.");
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) recognitionRef.current.stop();
        setIsListening(false);
    };

    const handleClose = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setInputText("");
        setSearchQuery("");
        setSearchResults([]);
        setHasSearched(false);
        onClose();
    };

    // if (!isOpen) return null; // Removed to allow AnimatePresence to handle mounting/unmounting

    const tabs = [
        { id: 'ai-scan', label: 'AI Scan', icon: Camera, color: 'from-emerald-400 to-teal-500' },
        { id: 'voice', label: 'Giọng nói', icon: Mic, color: 'from-blue-400 to-indigo-500' },
        { id: 'search', label: 'Thư viện', icon: Search, color: 'from-purple-400 to-pink-500' }
    ];

    return (
        <>
            <AnimatePresence>
                {isOpen ? (
                    <motion.div
                        key="modal-portal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    >
                        <motion.div
                            key="modal-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />

                        <motion.div
                            key="modal-body"
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-xl bg-white/90 backdrop-blur-2xl rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden border border-white/50 flex flex-col max-h-[85vh]"
                        >
                            {/* Header with Iridescent Glow */}
                            <div className="relative p-8 pb-6 shrink-0 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400" />
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                            <div className="p-2 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-500/20">
                                                <Sparkles className="w-5 h-5" />
                                            </div>
                                            Đổi Bữa Ăn
                                        </h3>
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                            <span className="px-2 py-0.5 bg-slate-100 rounded-md">Bữa {mealType}</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                            <span>Ngày {day}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all active:scale-90"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Premium Tabs Container */}
                            {!result && (
                                <div className="px-8 mb-4 shrink-0">
                                    <div className="flex p-1.5 bg-slate-100/50 rounded-[24px] gap-1 border border-slate-200/50">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id as LogMode)}
                                                className={clsx(
                                                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-[18px] text-[11px] font-black transition-all duration-500 relative overflow-hidden group",
                                                    activeTab === tab.id
                                                        ? "bg-white text-slate-900 shadow-[0_8px_16px_-4px_rgba(0,0,0,0.1)] ring-1 ring-slate-200"
                                                        : "text-slate-400 hover:text-slate-600"
                                                )}
                                            >
                                                <tab.icon className={clsx("w-4 h-4 transition-transform duration-500 group-hover:scale-110", activeTab === tab.id ? "text-emerald-500" : "")} />
                                                {tab.label}
                                                {activeTab === tab.id && (
                                                    <motion.div layoutId="tab-glow" className="absolute bottom-0 w-8 h-1 bg-emerald-500 rounded-full" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Main Content Area */}
                            <div className="flex-1 px-8 pb-8 min-h-[520px] max-h-[520px] flex flex-col overflow-hidden">
                                <AnimatePresence mode="wait">
                                    {result ? (
                                        <motion.div
                                            key="result"
                                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-10"
                                        >
                                            <div className="relative">
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                    className="absolute inset-0 bg-emerald-400 rounded-full blur-2xl"
                                                />
                                                <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[32px] flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40">
                                                    <CheckCircle2 className="w-12 h-12" strokeWidth={2.5} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-black text-emerald-600 uppercase tracking-widest">Tuyệt vời!</h4>
                                                <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none capitalize italic">{result.foodName}</p>
                                                <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-sm font-black shadow-xl">
                                                    <Sparkles className="w-4 h-4 text-emerald-400" />
                                                    {result.estimatedCalories} kcal
                                                </div>
                                            </div>
                                            <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-[280px]">
                                                {result.nutritionDetails}
                                            </p>
                                        </motion.div>
                                    ) : activeTab === 'ai-scan' ? (
                                        <motion.div key="ai-scan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col space-y-6 overflow-y-auto no-scrollbar">
                                            <div
                                                className={clsx(
                                                    "group relative border-2 border-dashed rounded-[40px] transition-all duration-500 flex flex-col items-center justify-center p-10 text-center cursor-pointer flex-1 overflow-hidden bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-emerald-500/5",
                                                    preview ? 'border-emerald-500 ring-4 ring-emerald-500/5' : 'border-slate-200 hover:border-emerald-400'
                                                )}
                                                onClick={() => document.getElementById('meal-upload')?.click()}
                                            >
                                                {preview ? (
                                                    <div className="relative w-full aspect-[4/3] rounded-[28px] overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-105">
                                                        <img src={preview} alt="Meal preview" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <div className="bg-white/20 backdrop-blur-xl p-4 rounded-3xl border border-white/30 text-white font-black text-xs uppercase tracking-widest">Đổi ảnh</div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        <div className="relative w-20 h-20 mx-auto">
                                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-gradient-to-tr from-emerald-400/20 to-blue-400/20 rounded-3xl blur-xl" />
                                                            <div className="relative w-full h-full bg-white rounded-3xl border border-slate-100 shadow-xl flex items-center justify-center text-emerald-500">
                                                                <Upload className="w-8 h-8" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-lg font-black text-slate-800">Tải ảnh bữa ăn</p>
                                                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Hỗ trợ JPG, PNG, HEIC</p>
                                                        </div>
                                                    </div>
                                                )}
                                                <input type="file" id="meal-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                                            </div>
                                            <button
                                                onClick={handleAILog}
                                                disabled={!file || loading}
                                                className="w-full h-16 bg-slate-900 text-white rounded-3xl font-black shadow-2xl shadow-black/20 hover:bg-black transition-all disabled:opacity-30 shrink-0 flex items-center justify-center gap-3 group active:scale-[0.98]"
                                            >
                                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Phân tích ngay <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
                                            </button>
                                        </motion.div>
                                    ) : activeTab === 'voice' ? (
                                        <motion.div key="voice" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col space-y-8 items-center py-4 overflow-y-auto no-scrollbar">
                                            <div className="flex flex-col items-center space-y-6 w-full shrink-0">
                                                <div className="relative">
                                                    {isListening && (
                                                        <>
                                                            <motion.div animate={{ scale: [1, 1.8], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 rounded-full bg-blue-400 blur-xl" />
                                                            <motion.div animate={{ scale: [1, 2.2], opacity: [0.3, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} className="absolute inset-0 rounded-full bg-blue-300 blur-2xl" />
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={toggleListening}
                                                        className={clsx(
                                                            "w-28 h-28 rounded-[40px] flex items-center justify-center transition-all duration-700 relative z-10 overflow-hidden",
                                                            isListening ? "bg-slate-900 shadow-2xl scale-110" : "bg-gradient-to-br from-blue-400 to-indigo-600 shadow-xl shadow-blue-500/20"
                                                        )}
                                                    >
                                                        {isListening ? (
                                                            <div className="flex items-center gap-1.5 h-10">
                                                                {[1, 2, 3, 4, 5].map(i => (
                                                                    <motion.div
                                                                        key={i}
                                                                        animate={{ height: [15, 40, 15] }}
                                                                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                                                                        className="w-1.5 bg-blue-400 rounded-full"
                                                                    />
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <Mic className="w-12 h-12 text-white" />
                                                        )}
                                                    </button>
                                                </div>

                                                <div className="text-center space-y-2">
                                                    <p className="text-xl font-black text-slate-800">
                                                        {isListening ? "Hệ thống đang nghe..." : "Nhấn để bắt đầu"}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                                                        "Hôm nay tôi đã ăn một bát bún chả"
                                                    </p>
                                                </div>

                                                <div className="w-full bg-slate-50/80 rounded-[32px] p-6 border border-slate-100 min-h-[160px] flex flex-col items-center justify-center relative group transition-all hover:bg-white hover:shadow-xl hover:shadow-blue-500/5">
                                                    <textarea
                                                        value={inputText}
                                                        onChange={(e) => setInputText(e.target.value)}
                                                        placeholder="Lời của bạn sẽ hiển thị tại đây..."
                                                        className={clsx(
                                                            "w-full bg-transparent border-none focus:ring-0 text-center text-lg font-bold leading-relaxed transition-all resize-none placeholder:text-slate-300 no-scrollbar custom-scrollbar",
                                                            inputText ? "text-slate-800" : "text-slate-300 italic"
                                                        )}
                                                        rows={3}
                                                    />
                                                    <div className="absolute bottom-4 right-6 flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span>Có thể chỉnh sửa</span>
                                                        <MessageSquare className="w-3.5 h-3.5" />
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleVoiceLog}
                                                disabled={!inputText || loading}
                                                className="w-full h-16 bg-slate-900 text-white rounded-3xl font-black shadow-2xl shadow-black/20 transition-all disabled:opacity-30 active:scale-98 shrink-0 mt-auto"
                                            >
                                                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Xác nhận & Phân tích"}
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="search" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col h-full overflow-hidden relative">
                                            {/* Ultra-Clean Floating Search Bar */}
                                            <div className="sticky top-0 z-20 shrink-0 mb-4 bg-transparent">
                                                <div className="relative group">
                                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-[22px] blur opacity-0 group-focus-within:opacity-10 transition-opacity duration-500" />
                                                    <div className="relative flex items-center">
                                                        <Search className="absolute left-5 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                                                        <input
                                                            type="text"
                                                            value={searchQuery}
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                            placeholder="Tìm món ăn yêu thích..."
                                                            className="w-full pl-12 pr-10 py-3.5 rounded-[18px] bg-white border border-slate-100 focus:bg-white focus:ring-4 focus:ring-purple-500/5 focus:border-purple-200 transition-all font-bold placeholder:text-slate-300 text-slate-700 text-sm"
                                                        />
                                                        {loading && (
                                                            <div className="absolute right-5">
                                                                <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Scrollable List */}
                                            <div className="flex-1 overflow-y-auto no-scrollbar -mt-2 pb-4">
                                                <div className="grid gap-4">
                                                    {searchResults.length > 0 ? (
                                                        searchResults.map((dish, index) => (
                                                            <motion.button
                                                                key={dish.id || `dish-${index}`}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                onClick={() => handleSelectDish(dish)}
                                                                className="w-full group flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[28px] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] hover:border-purple-200 transition-all text-left relative overflow-hidden active:scale-[0.98]"
                                                            >
                                                                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                <div className="space-y-0.5">
                                                                    <p className="font-black text-slate-800 group-hover:text-purple-600 transition-colors uppercase tracking-tight">{dish.name}</p>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-400 text-[9px] font-black rounded uppercase tracking-widest">{dish.category}</span>
                                                                        <span className="text-[10px] font-black text-emerald-500 italic">{dish.baseCalories} kcal</span>
                                                                    </div>
                                                                </div>
                                                                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-sm">
                                                                    <ChevronRight className="w-5 h-5" />
                                                                </div>
                                                            </motion.button>
                                                        ))
                                                    ) : hasSearched ? (
                                                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                                            <AlertCircle className="w-12 h-12 mb-4 opacity-10" />
                                                            <p className="text-sm font-black uppercase tracking-widest opacity-40">Không tìm thấy dữ liệu</p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center h-full text-slate-300 border-2 border-dashed border-slate-100 rounded-[40px]">
                                                            <History className="w-12 h-12 mb-4 opacity-10" />
                                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 italic text-center px-10 leading-relaxed">
                                                                Vui lòng nhập từ khóa <br /> để tìm kiếm món ăn
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Footer Warning with Clean Glass Effect */}
                            <div className="px-8 pb-8 shrink-0">
                                <div className="flex items-start gap-4 bg-slate-50/50 p-5 rounded-[32px] border border-slate-100/50">
                                    <div className="p-2 bg-white rounded-xl shadow-sm">
                                        <AlertCircle className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-wider italic">
                                        Chú ý: AI phân tích dựa trên dữ liệu trung bình. <br />
                                        <span className="opacity-60">Kết quả thực tế có thể thay đổi theo cách chế biến.</span>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                ) : null}
            </AnimatePresence>

            <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; }
            .no-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>
        </>
    );
};
