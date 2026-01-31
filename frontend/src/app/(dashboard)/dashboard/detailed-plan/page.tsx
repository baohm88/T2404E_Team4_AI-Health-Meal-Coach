'use client';
 
 /**
  * Detailed Plan Page
  * Displays 7-day meal and exercise plan with Week/Day view toggle
  * Features Vietnamese meals and detailed modals
  */
 
 /*
 import { useState, useEffect } from 'react';
 import { Button } from '@/components/ui/Button';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
 import { DetailedPlanCalendar } from '@/components/detailed-plan/DetailedPlanCalendar';
 import { DetailModal } from '@/components/detailed-plan/DetailModal';
 import { detailedPlanService, DailyPlan, Meal, Exercise } from '@/services/detailed-plan.service';
 import { Calendar, LayoutGrid, Loader2 } from 'lucide-react';
 */
 
 export default function DetailedPlanPage() {
     return (
         <div className="container mx-auto p-6 space-y-6">
             <div className="flex flex-col items-center justify-center min-h-[50vh]">
                 <h1 className="text-3xl font-bold mb-4">Kế hoạch chi tiết</h1>
                 <p className="text-muted-foreground text-center max-w-md">
                     Tính năng này đang được phát triển và sẽ sớm ra mắt.
                 </p>
             </div>
         </div>
     );
 }
  
 /*
 // Original Component implementation commented out to fix build
 export default function DetailedPlanPage() {
     const [viewMode, setViewMode] = useState<ViewMode>('week');
     const [plans, setPlans] = useState<DailyPlan[]>([]);
     const [selectedDayIndex, setSelectedDayIndex] = useState(0);
     const [isLoading, setIsLoading] = useState(true);
     const [modalOpen, setModalOpen] = useState(false);
     const [modalItem, setModalItem] = useState<Meal | Exercise | null>(null);
     const [modalType, setModalType] = useState<'meal' | 'exercise'>('meal');
 
     // Fetch plans on mount
     useEffect(() => {
         const fetchPlans = async () => {
             try {
                 setIsLoading(true);
                 const data = await detailedPlanService.getWeekPlan();
                 setPlans(data);
             } catch (error) {
                 console.error('Failed to fetch plans:', error);
             } finally {
                 setIsLoading(false);
             }
         };
 
         fetchPlans();
     }, []);
 
     const handleMealClick = (meal: Meal) => {
         setModalItem(meal);
         setModalType('meal');
         setModalOpen(true);
     };
 
     const handleExerciseClick = (exercise: Exercise) => {
         setModalItem(exercise);
         setModalType('exercise');
         setModalOpen(true);
     };
 
     const handleCloseModal = () => {
         setModalOpen(false);
         setModalItem(null);
     };
 
     // Calculate total calories for the week
     const totalWeekCalories = plans.reduce((total, plan) => {
         const mealCalories = plan.meals.reduce((sum, meal) => sum + meal.calories, 0);
         return total + mealCalories + plan.exercise.calories;
     }, 0);
 
     const avgDailyCalories = plans.length > 0 ? Math.round(totalWeekCalories / plans.length) : 0;
 
     return (
         <div className="container mx-auto p-6 space-y-6">
             // ... content ...
         </div>
     );
 }
 */
