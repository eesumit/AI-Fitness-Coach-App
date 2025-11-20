"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Activity, Target, Zap, Heart, TrendingUp, Users, Clock } from "lucide-react";
import Working from "@/components/Working";
import Link from "next/link";

// Pre-defined particle positions with colors
const PARTICLE_POSITIONS = [
  { x: 100, y: 200, delay: 0.2, duration: 4, color: "hsl(346.8, 77.2%, 49.8%)" },
  { x: 300, y: 150, delay: 1.5, duration: 5, color: "hsl(142.1, 76.2%, 36.3%)" },
  { x: 500, y: 300, delay: 0.8, duration: 3.5, color: "hsl(217.2, 91.2%, 59.8%)" },
  { x: 200, y: 400, delay: 2.1, duration: 4.2, color: "hsl(47.9, 95.8%, 53.1%)" },
  { x: 600, y: 250, delay: 1.2, duration: 3.8, color: "hsl(262.1, 83.3%, 57.8%)" },
  { x: 150, y: 350, delay: 0.5, duration: 4.5, color: "hsl(0, 84.2%, 60.2%)" },
  { x: 400, y: 100, delay: 1.8, duration: 3.2, color: "hsl(161.4, 93.5%, 30.4%)" },
  { x: 700, y: 180, delay: 0.9, duration: 4.8, color: "hsl(221.2, 83.2%, 53.3%)" },
  { x: 250, y: 280, delay: 2.3, duration: 3.7, color: "hsl(47.9, 95.8%, 53.1%)" },
  { x: 550, y: 320, delay: 1.1, duration: 4.1, color: "hsl(346.8, 77.2%, 49.8%)" },
];

// Custom cursor component
function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsPointer(window.getComputedStyle(e.target as Element).cursor === "pointer");
    };

    window.addEventListener("mousemove", updatePosition);
    return () => window.removeEventListener("mousemove", updatePosition);
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-primary rounded-full mix-blend-difference pointer-events-none z-50"
        animate={{
          x: position.x - 8,
          y: position.y - 8,
          scale: isPointer ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border-2 border-primary/80 rounded-full pointer-events-none z-50"
        animate={{
          x: position.x - 16,
          y: position.y - 16,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      />
    </>
  );
}

// Colorful animated grid background
function AnimatedGrid() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main grid */}
      <div className="absolute inset-0 bg-[linear-linear(rgba(255,255,255,0.03)_1px,transparent_1px),linear-linear(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-linear(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      
      {/* Colorful animated orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-linear-to-r from-primary to-purple-500 rounded-full blur-3xl opacity-20"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-linear-to-r from-green-500 to-cyan-500 rounded-full blur-3xl opacity-20"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 right-1/3 w-64 h-64 bg-linear-to-r from-pink-500 to-rose-500 rounded-full blur-3xl opacity-15"
        animate={{
          x: [50, -50, 50],
          y: [-30, 30, -30],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

// Floating particles with colors
function FloatingParticles() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {PARTICLE_POSITIONS.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: particle.color }}
          initial={{
            x: particle.x,
            y: particle.y,
            opacity: 0,
          }}
          animate={{
            y: [particle.y, particle.y - 100, particle.y],
            x: [particle.x, particle.x + 30, particle.x],
            opacity: [0, 0.6, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Define proper TypeScript types for variants
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

const features = [
  {
    icon: Activity,
    title: "Neural Adaptation",
    description: "AI continuously learns from your progress and adapts your plan in real-time",
    linear: "from-blue-500 to-cyan-500",
    bglinear: "from-blue-500/10 to-cyan-500/10",
  },
  {
    icon: Target,
    title: "Precision Targeting",
    description: "Laser-focused workouts targeting your specific goals and muscle groups",
    linear: "from-green-500 to-emerald-500",
    bglinear: "from-green-500/10 to-emerald-500/10",
  },
  {
    icon: Zap,
    title: "Instant Optimization",
    description: "Get real-time form correction and exercise substitutions",
    linear: "from-orange-500 to-red-500",
    bglinear: "from-orange-500/10 to-red-500/10",
  }
];

const stats = [
  { value: "10K+", label: "Active Users", icon: Users, color: "text-blue-500" },
  { value: "98%", label: "Satisfaction Rate", icon: Heart, color: "text-rose-500" },
  { value: "2.5x", label: "Faster Results", icon: TrendingUp, color: "text-green-500" },
  { value: "24/7", label: "AI Support", icon: Clock, color: "text-purple-500" },
];

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  const scrollToWorking = () => {
    const workingSection = document.getElementById('how-it-works');
    if (workingSection) {
      workingSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <>
      {/* Home Section */}
      <div className="min-h-screen flex items-center justify-center font-sans overflow-hidden relative">
        <CustomCursor />
        <AnimatedGrid />
        <FloatingParticles />
        
        <motion.div
          className="max-w-6xl px-6 text-center relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {/* Main heading with glow effect */}
          <motion.div variants={itemVariants} className="mb-8">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 border dark:bg-blue-100/10 border-blue-200/50 my-4 text-primary text-sm backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Fitness Revolution
            </motion.div>
            
            <motion.h1 
              className="mb-6 text-5xl sm:text-7xl font-bold tracking-tight"
              variants={itemVariants}
            >
              Transform Your
              <motion.span 
                className="block bg-linear-to-r from-primary via-purple-500 to-cyan-500 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                Body With AI
              </motion.span>
            </motion.h1>

            <motion.p 
              className="mb-10 text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Experience the future of fitness with hyper-personalized workout and nutrition plans 
              that evolve with you. Powered by advanced AI to maximize your results.
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col gap-4 sm:flex-row sm:justify-center mb-16"
            variants={itemVariants}
          >
            <motion.button
              className="group relative inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-primary to-purple-600 px-8 py-4 text-lg font-semibold text-primary-foreground shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative flex items-center gap-2">
                <Link href="/user-info" className="flex items-center gap-2">
                  Generate My AI Plan
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </span>
              <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300 -z-10" />
            </motion.button>

            <motion.button
              onClick={scrollToWorking}
              className="group relative inline-flex items-center justify-center rounded-2xl bg-card/50 backdrop-blur-sm px-8 py-4 text-lg font-semibold text-card-foreground border border-border hover:border-primary/50 transition-all duration-300 hover:bg-accent/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              See How It Works
              <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </motion.div>

          {/* Feature Cards */}
          <motion.div 
            className="grid grid-cols-1 gap-6 sm:grid-cols-3 mt-20"
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50 p-8 hover:border-primary/30 transition-all duration-500 overflow-hidden"
                variants={cardVariants}
                whileHover="hover"
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                transition={{ delay: index * 0.2 }}
              >
                {/* linear background effect */}
                <div className={`absolute inset-0 bg-linear-to-br ${feature.bglinear} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
                
                {/* Animated border linear */}
                <div className={`absolute inset-0 rounded-3xl bg-linear-to-r ${feature.linear} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-5`} />
                
                <div className="relative z-10">
                  <motion.div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-r ${feature.linear} mb-6 shadow-lg`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </motion.div>
                  
                  <h3 className="mb-4 text-xl font-bold text-card-foreground">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Colorful Stats bar */}
          <motion.div
            className="mt-16 pt-8 border-t border-border/50"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="group relative p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/30 hover:border-border/50 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative z-10">
                    <div className={`flex justify-center mb-3 ${stat.color}`}>
                      <stat.icon className="w-8 h-8" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                  <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 -z-10" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Working Section */}
      <Working isVisible={isVisible} />
    </>
  );
}