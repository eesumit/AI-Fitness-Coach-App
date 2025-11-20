"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    ArrowRight,
    Target,
    Dumbbell,
    Utensils,
    Trash2
} from "lucide-react";
import Link from "next/link";
import { Meal,WeekPlan } from "@/types/fitness";
interface FormData {
    name: string;
    fitnessGoal: string;
    fitnessLevel: string;
    age: string;
}

interface SavedPlan {
    id: string;
    userData: FormData;
    plan: WeekPlan;
    generatedAt: string;
}

export default function PlansList() {
    const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        const loadPlans = () => {
            try {
                const saved = localStorage.getItem('fitnessPlans');
                let plans: SavedPlan[] = [];

                if (saved) {
                    plans = JSON.parse(saved);
                }

                setSavedPlans(plans);
            } catch (error) {
                console.error("Error loading plans:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadPlans();
    }, []);

    const getPlanStats = (plan: SavedPlan) => {
        const firstDay = plan.plan?.day1;
        const exerciseCount = firstDay?.exercise_plan?.length || 0;
        const totalCalories = firstDay?.diet_plan ?
            Object.values(firstDay.diet_plan).reduce((total: number, meal: Meal) =>
                total + (parseInt(meal.calories) || 0), 0) : 0;

        return { exerciseCount, totalCalories };
    };

    const deletePlan = (planId: string) => {
        try {
            // Remove from localStorage
            const updatedPlans = savedPlans.filter(plan => plan.id !== planId);
            localStorage.setItem('fitnessPlans', JSON.stringify(updatedPlans));

            // Remove from state
            setSavedPlans(updatedPlans);

            // Close confirmation dialog
            setShowDeleteConfirm(null);
        } catch (error) {
            console.error("Error deleting plan:", error);
        }
    };

    const confirmDelete = (planId: string) => {
        setShowDeleteConfirm(planId);
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading your plans...</p>
                </div>
            </div>
        );
    }

    if (savedPlans.length === 0) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-foreground mb-2">No Plans Yet</h3>
                    <p className="text-muted-foreground mb-6">Create your first fitness plan to get started</p>
                    <Link
                        href="/user-info"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold hover:shadow-primary/25 transition-all"
                    >
                        Create Plan
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Your Fitness Plans</h1>
                    <p className="text-muted-foreground text-lg">
                        All your saved workout and nutrition plans
                    </p>
                </div>

                {/* Plans List */}
                <div className="space-y-6">
                    <AnimatePresence>
                        {savedPlans.map((plan, index) => {
                            const stats = getPlanStats(plan);

                            return (
                                <motion.div
                                    key={plan.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group relative"
                                >
                                    <div className="flex items-center justify-between">
                                        {/* Left Section - Basic Info */}
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                                <User className="w-6 h-6 text-primary" />
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="font-bold text-foreground text-lg">
                                                    {plan.userData?.name || 'User'}&apos;s Plan
                                                </h3>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className="text-sm text-muted-foreground capitalize">
                                                        {plan.userData?.fitnessGoal?.replace('-', ' ') || 'General Fitness'}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground capitalize">
                                                        {plan.userData?.fitnessLevel || 'Beginner'}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground">
                                                        {plan.userData?.age || 'N/A'} years
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Middle Section - Stats */}
                                        <div className="flex items-center gap-6 mx-8">
                                            <div className="text-center">
                                                <div className="flex items-center gap-2 text-foreground">
                                                    <Dumbbell className="w-4 h-4 text-blue-500" />
                                                    <span className="font-semibold">{stats.exerciseCount}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">Exercises</p>
                                            </div>

                                            <div className="text-center">
                                                <div className="flex items-center gap-2 text-foreground">
                                                    <Utensils className="w-4 h-4 text-green-500" />
                                                    <span className="font-semibold">{stats.totalCalories}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">Calories</p>
                                            </div>
                                        </div>

                                        {/* Right Section - Date & Actions */}
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(plan.generatedAt).toLocaleDateString()}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {Object.keys(plan.plan || {}).length} days
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/plans/${plan.id}`}  // Use plan.id, not array index
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:shadow-primary/25 transition-all"
                                                >
                                                    View
                                                    <ArrowRight className="w-4 h-4" />
                                                </Link>

                                                <button
                                                    onClick={() => confirmDelete(plan.id)}
                                                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all cursor-pointer"
                                                    title="Delete plan"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delete Confirmation Dialog */}
                                    <AnimatePresence>
                                        {showDeleteConfirm === plan.id && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10"
                                            >
                                                <div className="bg-card border border-border rounded-xl p-6 max-w-sm mx-4 text-center">
                                                    <Trash2 className="w-12 h-12 text-destructive mx-auto mb-4" />
                                                    <h4 className="font-bold text-foreground mb-2">Delete Plan?</h4>
                                                    <p className="text-muted-foreground mb-6">
                                                        This action cannot be undone. The plan will be permanently deleted.
                                                    </p>
                                                    <div className="flex gap-3 justify-center">
                                                        <button
                                                            onClick={cancelDelete}
                                                            className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-accent transition-all cursor-pointer"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => deletePlan(plan.id)}
                                                            className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all cursor-pointer"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Create New Plan */}
                <div className="text-center mt-12">
                    <Link
                        href="/user-info"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold hover:shadow-primary/25 transition-all"
                    >
                        Create New Plan
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}