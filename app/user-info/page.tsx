"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Calendar,
  VenusAndMars,
  Ruler,
  Weight,
  Target,
  Activity,
  Home,
  Utensils,
  Heart,
  Brain,
  CheckCircle2,
  AlertCircle,
  Scale,
  Repeat,
  HeartPulse,
  Carrot,
  Beef,
  Leaf,
  Fish,
  Building,
  Trees,
  Combine,
  Smile,
  Frown,
  Meh,
  Laugh,
  TrendingUp,
  Zap,
  Shield
} from "lucide-react";

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

type FormField = keyof FormData;

interface Errors {
  [key: string]: string;
}

interface InputFieldProps {
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

interface SelectFieldProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  field: FormField;
  options: { value: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
  value: string;
  error?: string;
  onChange: (field: FormField, value: string) => void;
}

// Fitness Goals with available Lucide icons
const fitnessGoals = [
  { value: "weight-loss", label: "Weight Loss", icon: Scale },
  { value: "muscle-gain", label: "Muscle Gain", icon: TrendingUp },
  { value: "maintenance", label: "Maintenance", icon: Repeat },
  { value: "endurance", label: "Endurance", icon: HeartPulse },
  { value: "flexibility", label: "Flexibility", icon: Activity },
  { value: "rehabilitation", label: "Rehabilitation", icon: Shield }
];

// Fitness Levels with available Lucide icons
const fitnessLevels = [
  { value: "beginner", label: "Beginner", icon: Activity },
  { value: "intermediate", label: "Intermediate", icon: Zap },
  { value: "advanced", label: "Advanced", icon: Target }
];

// Workout Locations with available Lucide icons
const workoutLocations = [
  { value: "home", label: "Home", icon: Home },
  { value: "gym", label: "Gym", icon: Building },
  { value: "outdoor", label: "Outdoor", icon: Trees },
  { value: "mixed", label: "Mixed", icon: Combine }
];

// Dietary Preferences with available Lucide icons
const dietaryPreferences = [
  { value: "vegetarian", label: "Vegetarian", icon: Carrot },
  { value: "non-vegetarian", label: "Non-Vegetarian", icon: Beef },
  { value: "vegan", label: "Vegan", icon: Leaf },
  { value: "keto", label: "Keto", icon: Beef },
  { value: "paleo", label: "Paleo", icon: Beef },
  { value: "mediterranean", label: "Mediterranean", icon: Fish }
];

// Stress Levels with available Lucide icons
const stressLevels = [
  { value: "low", label: "Low", icon: Laugh },
  { value: "moderate", label: "Moderate", icon: Smile },
  { value: "high", label: "High", icon: Meh },
  { value: "very-high", label: "Very High", icon: Frown }
];

// Gender Options with available Lucide icons
const genderOptions = [
  { value: "male", label: "Male", icon: User },
  { value: "female", label: "Female", icon: User },
  { value: "other", label: "Other", icon: User },
  { value: "prefer-not-to-say", label: "Prefer not to say", icon: User }
];

// Move components outside the main component
const InputField: React.FC<InputFieldProps> = ({
  icon: Icon,
  label,
  field,
  type = "text",
  placeholder,
  max,
  min,
  value,
  error,
  onChange
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-2"
  >
    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
      <Icon className="w-4 h-4" />
      {label}
    </label>
    <motion.input
      whileFocus={{ scale: 1.02 }}
      type={type}
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      placeholder={placeholder}
      max={max}
      min={min}
      className={`w-full px-4 py-3 rounded-2xl bg-card border backdrop-blur-sm transition-all duration-300 text-foreground ${error
          ? "border-red-500/50 focus:border-red-500"
          : "border-border focus:border-primary/50"
        } focus:outline-none focus:ring-2 focus:ring-primary/20`}
    />
    {error && (
      <motion.p
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="text-red-500 text-sm flex items-center gap-1"
      >
        <AlertCircle className="w-3 h-3" />
        {error}
      </motion.p>
    )}
  </motion.div>
);

const SelectField: React.FC<SelectFieldProps> = ({
  icon: Icon,
  label,
  field,
  options,
  value,
  error,
  onChange
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-3"
  >
    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
      <Icon className="w-4 h-4" />
      {label}
    </label>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {options.map((option, index) => {
        const OptionIcon = option.icon;
        return (
          <motion.button
            key={option.value}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onChange(field, option.value)}
            className={`px-4 py-1 rounded-2xl border backdrop-blur-sm transition-all duration-300 text-left group ${value === option.value
                ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "border-border bg-card hover:border-primary/30 hover:bg-accent/50 text-foreground"
              } ${error ? "border-red-500/50" : ""}`}
          >
            <div className={`flex items-center gap-3 ${value === option.value ? "text-primary-foreground" : "text-muted-foreground"
              }`}>
              <OptionIcon className="w-5 h-5" />
              <div className="text-sm font-medium">{option.label}</div>
            </div>
          </motion.button>
        );
      })}
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="text-red-500 text-sm flex items-center gap-1"
      >
        <AlertCircle className="w-3 h-3" />
        {error}
      </motion.p>
    )}
  </motion.div>
);

export default function GetUserInfo() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    fitnessGoal: "",
    fitnessLevel: "",
    workoutLocation: "",
    dietaryPreference: "",
    medicalHistory: "",
    stressLevel: ""
  });
  
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setIsVisible(true);
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  const validateField = (name: FormField, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.length < 2) return "Name must be at least 2 characters";
        if (value.length > 50) return "Name must be less than 50 characters";
        if (!/^[a-zA-Z\s]*$/.test(value)) return "Name can only contain letters and spaces";
        return "";

      case "age":
        if (!value) return "Age is required";
        const age = parseInt(value);
        if (isNaN(age) || age < 13 || age > 120) return "Age must be between 13 and 120";
        return "";

      case "height":
        if (!value) return "Height is required";
        const height = parseFloat(value);
        if (isNaN(height) || height < 100 || height > 250) return "Height must be between 100cm and 250cm";
        return "";

      case "weight":
        if (!value) return "Weight is required";
        const weight = parseFloat(value);
        if (isNaN(weight) || weight < 30 || weight > 300) return "Weight must be between 30kg and 300kg";
        return "";

      case "gender":
        if (!value) return "Please select your gender";
        return "";

      case "fitnessGoal":
        if (!value) return "Please select a fitness goal";
        return "";

      case "fitnessLevel":
        if (!value) return "Please select your fitness level";
        return "";

      case "workoutLocation":
        if (!value) return "Please select your preferred workout location";
        return "";

      case "dietaryPreference":
        if (!value) return "Please select your dietary preference";
        return "";

      case "stressLevel":
        // Stress level is optional, no validation needed
        return "";

      default:
        return "";
    }
  };

  const handleChange = (field: FormField, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all required fields
    const newErrors: Errors = {};
    const requiredFields: FormField[] = [
      "name", "age", "gender", "height", "weight",
      "fitnessGoal", "fitnessLevel", "workoutLocation",
      "dietaryPreference"
    ];

    requiredFields.forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    // Convert formData to URL params
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    // Navigate to user-plan page
    router.push(`/user-plan?${params.toString()}`);
  };

  return (
    <div className="font-sans min-h-screen bg-background text-foreground py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Create Your Fitness Profile
          </motion.h1>

          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Help us understand you better to create your personalized AI plan
          </motion.p>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {/* Personal Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 bg-card/50 rounded-3xl p-6 border border-border"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <User className="w-6 h-6 text-primary" />
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div data-field="name">
                <InputField
                  icon={User}
                  label="Full Name"
                  field="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  error={errors.name}
                  onChange={handleChange}
                />
              </div>
              <div data-field="age">
                <InputField
                  icon={Calendar}
                  label="Age"
                  field="age"
                  type="number"
                  placeholder="Your age"
                  min={13}
                  max={120}
                  value={formData.age}
                  error={errors.age}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div data-field="gender">
              <SelectField
                icon={VenusAndMars}
                label="Gender"
                field="gender"
                options={genderOptions}
                value={formData.gender}
                error={errors.gender}
                onChange={handleChange}
              />
            </div>
          </motion.div>

          {/* Body Metrics Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6 bg-card/50 rounded-3xl p-6 border border-border"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <Ruler className="w-6 h-6 text-primary" />
              Body Metrics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div data-field="height">
                <InputField
                  icon={Ruler}
                  label="Height (cm)"
                  field="height"
                  type="number"
                  placeholder="Your height in cm"
                  min={100}
                  max={250}
                  value={formData.height}
                  error={errors.height}
                  onChange={handleChange}
                />
              </div>
              <div data-field="weight">
                <InputField
                  icon={Weight}
                  label="Weight (kg)"
                  field="weight"
                  type="number"
                  placeholder="Your weight in kg"
                  min={30}
                  max={300}
                  value={formData.weight}
                  error={errors.weight}
                  onChange={handleChange}
                />
              </div>
            </div>
          </motion.div>

          {/* Fitness Goals Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 bg-card/50 rounded-3xl p-6 border border-border"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <Target className="w-6 h-6 text-primary" />
              Fitness Goals
            </h2>
            
            <div className="space-y-6">
              <div data-field="fitnessGoal">
                <SelectField
                  icon={Target}
                  label="Fitness Goal"
                  field="fitnessGoal"
                  options={fitnessGoals}
                  value={formData.fitnessGoal}
                  error={errors.fitnessGoal}
                  onChange={handleChange}
                />
              </div>
              <div data-field="fitnessLevel">
                <SelectField
                  icon={Activity}
                  label="Current Fitness Level"
                  field="fitnessLevel"
                  options={fitnessLevels}
                  value={formData.fitnessLevel}
                  error={errors.fitnessLevel}
                  onChange={handleChange}
                />
              </div>
            </div>
          </motion.div>

          {/* Preferences Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6 bg-card/50 rounded-3xl p-6 border border-border"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <Home className="w-6 h-6 text-primary" />
              Preferences
            </h2>
            
            <div className="space-y-6">
              <div data-field="workoutLocation">
                <SelectField
                  icon={Home}
                  label="Workout Location"
                  field="workoutLocation"
                  options={workoutLocations}
                  value={formData.workoutLocation}
                  error={errors.workoutLocation}
                  onChange={handleChange}
                />
              </div>
              <div data-field="dietaryPreference">
                <SelectField
                  icon={Utensils}
                  label="Dietary Preference"
                  field="dietaryPreference"
                  options={dietaryPreferences}
                  value={formData.dietaryPreference}
                  error={errors.dietaryPreference}
                  onChange={handleChange}
                />
              </div>
            </div>
          </motion.div>

          {/* Additional Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6 bg-card/50 rounded-3xl p-6 border border-border"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <Heart className="w-6 h-6 text-primary" />
              Additional Information
            </h2>
            
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Heart className="w-4 h-4" />
                  Medical History (Optional)
                </label>
                <motion.textarea
                  whileFocus={{ scale: 1.02 }}
                  value={formData.medicalHistory}
                  onChange={(e) => handleChange("medicalHistory", e.target.value)}
                  placeholder="Any medical conditions, injuries, or health concerns we should know about..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl bg-card border border-border backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 resize-none text-foreground"
                />
              </motion.div>

              <div data-field="stressLevel">
                <SelectField
                  icon={Brain}
                  label="Stress Level (Optional)"
                  field="stressLevel"
                  options={stressLevels}
                  value={formData.stressLevel}
                  error={errors.stressLevel}
                  onChange={handleChange}
                />
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            className="flex justify-center pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
              className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold transition-all duration-300 hover:shadow-primary/25 flex items-center gap-2 disabled:opacity-50 text-lg"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                  />
                  Creating Your Plan...
                </>
              ) : (
                <>
                  Generate AI Plan
                  <CheckCircle2 className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
}