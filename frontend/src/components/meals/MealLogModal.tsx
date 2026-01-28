"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, Upload, Camera, Loader2, CheckCircle2, AlertCircle,
    Mic, MessageSquare, Search, Sparkles, Send, History
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

type LogMode = 'ai-scan' | 'voice' | 'text' | 'search';

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

    // ---------------------------------------------------------------------
    // Handlers
    // ---------------------------------------------------------------------

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
                toast.success("AI đã nhận diện thành công!");
                setTimeout(() => { onSuccess(res.data); handleClose(); }, 2000);
            } else {
                toast.error(res.message || "Không thể phân tích ảnh.");
            }
        } catch (error: any) {
            toast.error("Lỗi khi gửi ảnh lên server.");
        } finally {
            setLoading(false);
        }
    };

    const handleTextOrVoiceLog = async () => {
        if (!inputText.trim()) return;
        try {
            setLoading(true);
            const res = await mealLogService.analyzeMealText(inputText, plannedMealId, mealType);
            if (res.success) {
                setResult(res.data);
                toast.success("Đã ghi nhận bữa ăn!");
                setTimeout(() => { onSuccess(res.data); handleClose(); }, 2000);
            } else {
                toast.error(res.message || "AI không hiểu món này.");
            }
        } catch (error: any) {
            toast.error("Lỗi khi kết nối server.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        try {
            setLoading(true);
            setHasSearched(true);
            const res = await mealLogService.searchDishes(searchQuery, mealType);
            if (res.success) {
                setSearchResults(res.data.content);
            }
        } catch (error) {
            toast.error("Lỗi khi tìm kiếm.");
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
                nutritionDetails: dish.description || "Chọn từ thư viện"
            };
            const res = await mealLogService.checkInByData(checkInData);
            if (res.success) {
                toast.success(`Đã đổi sang: ${dish.name}`);
                onSuccess({ foodName: dish.name, estimatedCalories: dish.baseCalories });
                handleClose();
            }
        } catch (error) {
            toast.error("Lỗi khi cập nhật.");
        } finally {
            setLoading(false);
        }
    };

    // ---------------------------------------------------------------------
    // Voice Recognition (Speech to Text)
    // ---------------------------------------------------------------------

    const toggleListening = () => {
        if (isListening) {
            stopListening();
            return;
        }

        // Kiểm tra HTTPS/Localhost (SpeechRecognition yêu cầu môi trường bảo mật)
        const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (!isSecure) {
            toast.error("Nhận diện giọng nói chỉ hoạt động trên HTTPS hoặc Localhost.");
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error("Trình duyệt không hỗ trợ nhận diện giọng nói. Hãy dùng Chrome hoặc Edge.");
            return;
        }

        try {
            const recognition = new SpeechRecognition();
            recognition.lang = 'vi-VN';
            recognition.continuous = true; // Chuyển sang true để nhận diện liên tục
            recognition.interimResults = true;

            recognition.onstart = () => {
                setIsListening(true);
                toast.info("Đã bật Micro. Hãy nói món ăn của bạn...");
            };

            recognition.onresult = (event: any) => {
                let currentTranscript = "";
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    currentTranscript += event.results[i][0].transcript;
                }

                if (currentTranscript) {
                    setInputText(currentTranscript);
                }
            };

            recognition.onerror = (event: any) => {
                console.error("Speech Recognition Error:", event.error);
                setIsListening(false);

                switch (event.error) {
                    case 'not-allowed':
                        toast.error("Vui lòng cho phép quyền truy cập Micro trong cài đặt trình duyệt.");
                        break;
                    case 'no-speech':
                        toast.warning("Không nghe thấy tiếng. Bạn vui lòng nói to hơn nhé.");
                        break;
                    case 'network':
                        toast.error("Lỗi kết nối mạng (Google Speech API cần mạng).");
                        break;
                    default:
                        toast.error(`Lỗi: ${event.error}`);
                }
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
            recognition.start();
        } catch (err) {
            console.error("Failed to start recognition:", err);
            toast.error("Không thể khởi động bộ nhận diện giọng nói.");
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
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

    if (!isOpen) return null;

    const tabs = [
        { id: 'ai-scan', label: 'AI Scan', icon: Camera },
        { id: 'voice', label: 'Giọng nói', icon: Mic },
        { id: 'text', label: 'Văn bản', icon: MessageSquare },
        { id: 'search', label: 'Thủ công', icon: Search }
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                        <div>
                            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-emerald-500" />
                                Đổi Bữa Ăn
                            </h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Bữa {mealType.toLowerCase()} • Ngày {day}</p>
                        </div>
                        <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    {/* Tabs Navigation */}
                    {!result && (
                        <div className="flex p-2 gap-1 bg-slate-50 border-b border-slate-100 shrink-0 overflow-x-auto no-scrollbar">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as LogMode)}
                                    className={clsx(
                                        "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap",
                                        activeTab === tab.id
                                            ? "bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200"
                                            : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                                    )}
                                >
                                    <tab.icon className="w-3.5 h-3.5" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 min-h-[300px] flex flex-col">
                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 text-center space-y-4 my-auto"
                                >
                                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white shadow-lg shadow-emerald-200">
                                        <CheckCircle2 className="w-12 h-12" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-emerald-800 font-black text-lg">Đã đổi thành công!</h4>
                                        <p className="text-3xl font-black text-emerald-600 capitalize leading-tight">{result.foodName}</p>
                                        <div className="inline-flex px-4 py-1.5 bg-white border border-emerald-100 rounded-full text-emerald-500 font-black shadow-sm">
                                            ~{result.estimatedCalories} kcal
                                        </div>
                                    </div>
                                    <p className="text-emerald-700/70 text-xs italic leading-relaxed px-4">
                                        {result.nutritionDetails}
                                    </p>
                                </motion.div>
                            ) : activeTab === 'ai-scan' ? (
                                <motion.div key="ai-scan" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                    <div
                                        className={clsx(
                                            "relative border-2 border-dashed rounded-[32px] transition-all flex flex-col items-center justify-center p-8 text-center cursor-pointer min-h-[220px]",
                                            preview ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50'
                                        )}
                                        onClick={() => document.getElementById('meal-upload')?.click()}
                                    >
                                        {preview ? (
                                            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl">
                                                <img src={preview} alt="Meal preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                    <Camera className="w-8 h-8 text-white drop-shadow-lg" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-500">
                                                    <Upload className="w-8 h-8" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-700">Tải ảnh bữa ăn</p>
                                                    <p className="text-xs text-slate-400 font-medium">Bấm để chọn hoặc chụp ảnh</p>
                                                </div>
                                            </div>
                                        )}
                                        <input type="file" id="meal-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </div>
                                    <button
                                        onClick={handleAILog}
                                        disabled={!file || loading}
                                        className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2 active:scale-[0.98]"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Phân tích món ăn</>}
                                    </button>
                                </motion.div>
                            ) : activeTab === 'voice' ? (
                                <motion.div key="voice" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 flex flex-col items-center py-8">
                                    <button
                                        onClick={toggleListening}
                                        className={clsx(
                                            "w-24 h-24 rounded-full flex items-center justify-center transition-all relative",
                                            isListening ? "bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)] scale-110" : "bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-200"
                                        )}
                                    >
                                        {isListening ? (
                                            <div className="flex items-center gap-1.5 z-10">
                                                <motion.div animate={{ height: [10, 25, 10] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1.5 bg-white rounded-full" />
                                                <motion.div animate={{ height: [20, 40, 20] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-1.5 bg-white rounded-full" />
                                                <motion.div animate={{ height: [10, 25, 10] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-1.5 bg-white rounded-full" />
                                            </div>
                                        ) : (
                                            <Mic className="w-10 h-10 text-white relative z-10" />
                                        )}

                                        {isListening && (
                                            <motion.div
                                                initial={{ scale: 0.5, opacity: 0.5 }}
                                                animate={{ scale: 2.2, opacity: 0 }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                                className="absolute inset-0 rounded-full bg-red-400"
                                            />
                                        )}
                                    </button>

                                    <div className="text-center space-y-2">
                                        <p className="font-black text-slate-700">
                                            {isListening ? "Đang lắng nghe... bấm để dừng" : "Bấm để bắt đầu nói"}
                                        </p>
                                        <p className="text-xs text-slate-400 font-medium px-8 italic whitespace-pre-line leading-relaxed">
                                            Ví dụ: "Hôm nay tôi ăn một bát phở bò"
                                        </p>
                                    </div>

                                    {inputText && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="w-full p-5 bg-slate-50 rounded-[28px] border border-slate-100 mt-2 text-center shadow-sm"
                                        >
                                            <p className="text-sm font-bold text-slate-600 leading-relaxed italic">
                                                "{inputText}"
                                            </p>
                                        </motion.div>
                                    )}

                                    <button
                                        onClick={handleTextOrVoiceLog}
                                        disabled={!inputText || loading}
                                        className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black shadow-xl shadow-emerald-500/20 mt-4 transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Xác nhận món ăn"}
                                    </button>
                                </motion.div>
                            ) : activeTab === 'text' ? (
                                <motion.div key="text" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                    <div className="relative">
                                        <textarea
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            placeholder="Gõ tên món ăn bạn vừa ăn..."
                                            className="w-full h-32 p-4 pt-4 rounded-3xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all resize-none font-medium placeholder:text-slate-300"
                                        />
                                        <div className="absolute right-4 bottom-4 p-2 bg-emerald-50 rounded-xl text-emerald-500">
                                            <Send className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleTextOrVoiceLog}
                                        disabled={!inputText.trim() || loading}
                                        className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Phân tích món ăn"}
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div key="search" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 flex flex-col h-full">
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                            placeholder="Tìm kiếm trong thư viện món..."
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold placeholder:text-slate-300 shadow-sm"
                                        />
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                                        <button
                                            onClick={handleSearch}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black rounded-lg hover:bg-black transition-colors"
                                        >
                                            TÌM
                                        </button>
                                    </div>

                                    <div className="flex-1 space-y-2 max-h-[250px] overflow-y-auto no-scrollbar pb-2">
                                        {searchResults.length > 0 ? (
                                            searchResults.map((dish) => (
                                                <button
                                                    key={dish.id}
                                                    onClick={() => handleSelectDish(dish)}
                                                    className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-emerald-50 hover:border-emerald-200 transition-all text-left group"
                                                >
                                                    <div>
                                                        <p className="font-bold text-slate-800 transition-colors group-hover:text-emerald-700">{dish.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{dish.category}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-black text-emerald-600">{dish.baseCalories} kcal</span>
                                                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                        </div>
                                                    </div>
                                                </button>
                                            ))
                                        ) : hasSearched ? (
                                            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                                <AlertCircle className="w-10 h-10 mb-2 opacity-20" />
                                                <p className="text-sm font-bold">Không tìm thấy món "{searchQuery}"</p>
                                                <p className="text-xs opacity-60">Hãy nhập từ khoá khác hoặc dùng công cụ khác để nhập món ăn nhé</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-12 text-slate-300">
                                                <History className="w-10 h-10 mb-2 opacity-20" />
                                                <p className="text-xs font-bold italic opacity-40">Nhập từ khóa và bấm tìm kiếm</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer Warning */}
                    <div className="px-6 pb-6 pt-2 shrink-0 bg-white">
                        <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                                Lưu ý: Hệ thống AI phân tích dựa trên dữ liệu chuẩn.
                                <br />
                                Lượng calo thực tế có thể chênh lệch tùy theo cách chế biến.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

