"use client";

import { motion } from "framer-motion";

export default function GeneratingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
      />

      <p className="mt-4 text-lg text-primary font-medium">
        Generating your personalized AI fitness plan...
      </p>
    </div>
  );
}
