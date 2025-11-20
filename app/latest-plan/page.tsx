"use client";

import { useState, useEffect } from "react";
import FinalPlanScreen from "@/components/FinalPlanScreen";
import { SavedPlan } from "@/types/fitness";
export default function PlanDetailPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [savedPlan, setSavedPlan] = useState<SavedPlan | null>(null);

  useEffect(() => {
    const loadPlanData = () => {
      if (typeof window !== 'undefined') {
        try {
          const savedPlans = localStorage.getItem('fitnessPlans');
          console.log("Saved plans from localStorage:", savedPlans);
          
          if (savedPlans) {
            const plans: SavedPlan[] = JSON.parse(savedPlans);
            console.log("Parsed plans:", plans);
            
            // Find plan by ID (not by array index)
            const foundPlan = plans[0]
            console.log("Found plan:", foundPlan);
            
            if (foundPlan) {
              setSavedPlan(foundPlan);
            }
          } else {
            console.log("No saved plans found in localStorage");
          }
        } catch (error) {
          console.error("Error loading plan:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadPlanData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your plan...</p>
        </div>
      </div>
    );
  }

  if (!savedPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">Plan not found</p>
          <a 
            href="/plans" 
            className="text-primary hover:underline"
          >
            Back to Plans
          </a>
        </div>
      </div>
    );
  }

  return (
    <FinalPlanScreen 
      data={savedPlan.userData} 
      savedPlan={savedPlan.plan}
      isFromSavedPlans={true}
    />
  );
}