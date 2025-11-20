"use client";

import { useSearchParams } from "next/navigation";
import FinalPlanScreen from "@/components/FinalPlanScreen";

interface FormData {
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  fitnessGoal: string;
  fitnessLevel: string;
  workoutLocation: string;
  dietaryPreference: string;
  medicalHistory: string;
  stressLevel: string;
}

export default function UserPlanPage() {
  const searchParams = useSearchParams();

  // Compute formData directly from searchParams
  const formData: FormData | null = searchParams ? {
    name: searchParams.get("name") || "",
    age: searchParams.get("age") || "",
    gender: searchParams.get("gender") || "",
    height: searchParams.get("height") || "",
    weight: searchParams.get("weight") || "",
    fitnessGoal: searchParams.get("fitnessGoal") || "",
    fitnessLevel: searchParams.get("fitnessLevel") || "",
    workoutLocation: searchParams.get("workoutLocation") || "",
    dietaryPreference: searchParams.get("dietaryPreference") || "",
    medicalHistory: searchParams.get("medicalHistory") || "",
    stressLevel: searchParams.get("stressLevel") || "",
  } : null;

  // Check if we have any data
  const hasData = formData && Object.values(formData).some(value => value !== "");

  if (!hasData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">No plan data found</p>
          <a 
            href="/user-info" 
            className="text-primary hover:underline"
          >
            Go back to create your plan
          </a>
        </div>
      </div>
    );
  }

  return <FinalPlanScreen data={formData} />;
}