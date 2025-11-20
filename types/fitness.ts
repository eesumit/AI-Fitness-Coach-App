// types/fitness.ts

export interface UserData {
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

export interface Exercise {
  name: string;
  sets: number | string;
  reps: string;
  rest: string;
  muscle_group: string;
  notes?: string;
}

export interface Meal {
  item: string;
  calories: string; // Change to string only
  protein_g: string; // Change to string only
  notes?: string;
}

// In your types/fitness.ts
export interface DietPlan {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  [key: string]: Meal; // Add index signature
}

export interface DayPlan {
  exercise_plan: Exercise[];
  diet_plan: DietPlan;
  exercise_tts_prompt: string;
  diet_tts_prompt: string;
  exercise_image_prompt: string;
  diet_image_prompt: string;
  motivation_quote: string;
}

export interface WeekPlan {
  day1: DayPlan;
  day2: DayPlan;
  day3: DayPlan;
  day4: DayPlan;
  day5: DayPlan;
  day6: DayPlan;
  day7: DayPlan;
}

export interface SavedPlan {
  id: string;
  userData: UserData;
  plan: WeekPlan;
  generatedAt: string;
}

export interface FinalPlanScreenProps {
  data: UserData;
  savedPlan?: WeekPlan;
  isFromSavedPlans?: boolean;
}

export interface APIResponse {
  week_plan: WeekPlan;
  error?: string;
}

// For form components
// export interface FormData extends UserData {}

export type FormField = keyof FormData;

export interface Errors {
  [key: string]: string;
}

export interface InputFieldProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  field: FormField;
  type?: string;
  placeholder?: string;
  max?: number;
  min?: number;
  value: string;
  error?: string;
  onChange: (field: FormField, value: string) => void;
}

export interface SelectFieldProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  field: FormField;
  options: { value: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
  value: string;
  error?: string;
  onChange: (field: FormField, value: string) => void;
}