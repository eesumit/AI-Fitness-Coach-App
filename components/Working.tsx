"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { 
  Brain, 
  Target, 
  BarChart3, 
  Calendar, 
  Smartphone, 
  Zap,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

// CSS Variables for theme - same as Home component
const themeStyles = `
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
  }
`;

const cssVariables = {
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  card: "hsl(var(--card))",
  cardForeground: "hsl(var(--card-foreground))",
  primary: "hsl(var(--primary))",
  primaryForeground: "hsl(var(--primary-foreground))",
  muted: "hsl(var(--muted))",
  mutedForeground: "hsl(var(--muted-foreground))",
  accent: "hsl(var(--accent))",
  accentForeground: "hsl(var(--accent-foreground))",
  border: "hsl(var(--border))",
  input: "hsl(var(--input))",
  ring: "hsl(var(--ring))",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.8,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut" as const,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
  hover: {
    scale: 1.05,
    y: -10,
    transition: {
      duration: 0.3,
      ease: "easeInOut" as const,
    },
  },
};

const steps = [
  {
    icon: Brain,
    title: "AI Assessment",
    description: "Our advanced AI analyzes your fitness level, goals, and preferences through a quick interactive assessment.",
    features: ["Body metrics analysis", "Goal identification", "Lifestyle assessment", "Preference mapping"]
  },
  {
    icon: Target,
    title: "Personalized Plan",
    description: "Get a completely customized workout and nutrition plan tailored specifically to your needs and schedule.",
    features: ["Custom workout routines", "Personalized nutrition", "Schedule optimization", "Equipment adaptation"]
  },
  {
    icon: BarChart3,
    title: "Track & Adapt",
    description: "The AI continuously learns from your progress and adapts your plan in real-time for optimal results.",
    features: ["Progress tracking", "Real-time adjustments", "Performance analytics", "Adaptive difficulty"]
  }
];

const features = [
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Automatically adapts to your calendar and energy levels"
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Access your plan anywhere with our intuitive mobile app"
  },
  {
    icon: Zap,
    title: "Instant Updates",
    description: "Get real-time plan adjustments based on your progress"
  }
];

interface WorkingProps {
  isVisible?: boolean;
}

export default function Working({ isVisible = true }: WorkingProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <style jsx global>{`
        ${themeStyles}
      `}</style>

      <motion.div
        ref={containerRef}
        id="how-it-works"
        className="min-h-screen py-20 px-6 relative overflow-hidden"
        style={{
          backgroundColor: cssVariables.background,
          color: cssVariables.foreground,
        }}
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {/* Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div 
            className="absolute inset-0 bg-[size:64px_64px]"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--primary) / 0.02) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.02) 1px, transparent 1px)`
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div className="text-center mb-20" variants={itemVariants}>
            <motion.div
              style={{
                backgroundColor: cssVariables.primary + '1A',
                borderColor: cssVariables.primary + '33',
                color: cssVariables.primary,
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 text-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Zap className="w-4 h-4" />
              How It Works
            </motion.div>
            
            <motion.h2 
              className="text-4xl sm:text-6xl font-bold tracking-tight mb-6"
              style={{
                background: `linear-gradient(to bottom right, ${cssVariables.foreground}, ${cssVariables.mutedForeground})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Transform Your Fitness in
              <motion.span 
                className="block"
                style={{
                  background: `linear-gradient(to right, ${cssVariables.primary}, ${cssVariables.primary}80)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                animate={{ 
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                3 Simple Steps
              </motion.span>
            </motion.h2>

            <motion.p 
              className="text-xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: cssVariables.mutedForeground }}
            >
              Experience the future of fitness with our AI-powered platform that adapts to you 
              and delivers real results faster than ever before.
            </motion.p>
          </motion.div>

          {/* Steps */}
          <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20" variants={containerVariants}>
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                style={{
                  backgroundColor: cssVariables.card,
                  borderColor: cssVariables.border,
                }}
                className="group relative rounded-3xl backdrop-blur-sm border p-8 transition-all duration-500"
                variants={cardVariants}
                whileHover="hover"
                transition={{ delay: index * 0.2 }}
              >
                <div 
                  className="absolute inset-0 rounded-3xl transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(to right, ${cssVariables.primary}1A, ${cssVariables.primary}0D)`,
                    opacity: 0,
                  }}
                />
                
                <div className="relative z-10">
                  <div className="flex items-start gap-6 mb-6">
                    <motion.div
                      style={{ backgroundColor: cssVariables.primary }}
                      className="inline-flex items-center justify-center w-14 h-14 rounded-2xl flex-shrink-0"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <step.icon 
                        className="w-6 h-6" 
                        style={{ color: cssVariables.primaryForeground }} 
                      />
                    </motion.div>
                    <div className="flex-1">
                      <div 
                        className="text-2xl font-bold mb-2"
                        style={{ color: cssVariables.cardForeground }}
                      >
                        {step.title}
                      </div>
                      <p 
                        className="leading-relaxed mb-4"
                        style={{ color: cssVariables.mutedForeground }}
                      >
                        {step.description}
                      </p>
                      <ul className="space-y-2">
                        {step.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-2">
                            <CheckCircle2 
                              className="w-4 h-4 flex-shrink-0" 
                              style={{ color: cssVariables.primary }}
                            />
                            <span 
                              className="text-sm"
                              style={{ color: cssVariables.mutedForeground }}
                            >
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Features */}
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h3 
              className="text-3xl font-bold mb-12"
              style={{ color: cssVariables.foreground }}
            >
              Why Choose AI Fitness?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  style={{
                    backgroundColor: cssVariables.card,
                    borderColor: cssVariables.border,
                  }}
                  className="group relative rounded-2xl backdrop-blur-sm border p-6 transition-all duration-500"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    style={{ backgroundColor: cssVariables.primary }}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon 
                      className="w-5 h-5" 
                      style={{ color: cssVariables.primaryForeground }} 
                    />
                  </motion.div>
                  
                  <h4 
                    className="text-lg font-bold mb-2"
                    style={{ color: cssVariables.cardForeground }}
                  >
                    {feature.title}
                  </h4>
                  
                  <p 
                    className="text-sm leading-relaxed"
                    style={{ color: cssVariables.mutedForeground }}
                  >
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div className="text-center" variants={itemVariants}>
            <motion.button
              style={{
                backgroundColor: cssVariables.primary,
                color: cssVariables.primaryForeground,
              }}
              className="group relative inline-flex items-center justify-center rounded-2xl px-8 py-4 text-lg font-semibold shadow-2xl transition-all duration-300 hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative flex items-center gap-2">
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div 
                className="absolute inset-0 rounded-2xl blur-lg transition-opacity duration-300 -z-10"
                style={{
                  backgroundColor: cssVariables.primary + 'CC',
                  opacity: 0,
                }}
              />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}