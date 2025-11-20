"use client";

import { useState, useEffect } from "react";
import GeneratingScreen from "./GeneratingScreen";
import { motion } from "framer-motion";
import {
  Volume2,
  VolumeOff,
  CheckCircle2,
  AlertCircle,
  Utensils,
  Target,
  Calendar,
  Zap,
  Heart,
  TrendingUp,
  Flame,
  Dumbbell,
  Carrot,
  Apple,
  Download,
  RefreshCw,
  Save
} from "lucide-react";
import {
  FinalPlanScreenProps,
  WeekPlan,
  DayPlan,
  Exercise,
  Meal
} from '@/types/fitness';
interface JSPDFModule {
  default: typeof import('jspdf').default;
  jsPDF?: typeof import('jspdf').default;
}
export default function FinalPlanScreen({ data, savedPlan, isFromSavedPlans = false }: FinalPlanScreenProps) {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<WeekPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const [currentPlayingDay, setCurrentPlayingDay] = useState<string | null>(null);
  const [audioInstances, setAudioInstances] = useState<{ [key: string]: HTMLAudioElement }>({});
  const [loadingAudio, setLoadingAudio] = useState<{ [key: string]: boolean }>({});
  const [generatingImages, setGeneratingImages] = useState<{ [key: string]: boolean }>({});
  const [generatedImages, setGeneratedImages] = useState<{ [key: string]: string }>({});
  const [audioCache, setAudioCache] = useState<{ [key: string]: string }>({});
const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // If coming from saved plans, use the saved plan directly
    if (isFromSavedPlans && savedPlan) {
      setPlan(savedPlan);
      setLoading(false);
      return;
    }

    // Otherwise, generate new plan
    async function fetchPlan() {
      try {
        setLoading(true);
        const response = await fetch("/api/generate-plan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.error || "Something went wrong generating your plan.");
          return;
        }

        setPlan(result.week_plan);
      } catch (err) {
        console.error(err);
        setError("Network error. Try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchPlan();
  }, [data, isFromSavedPlans, savedPlan]);

  const handleRegeneratePlan = async () => {
    setIsRegenerating(true);
    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Something went wrong regenerating your plan.");
        return;
      }

      setPlan(result.week_plan);
    } catch (err) {
      console.error(err);
      setError("Network error. Try again.");
    } finally {
      setIsRegenerating(false);
    }
  };
  const handleDownloadPDF = async () => {
    if (!plan) {
      alert("No plan available to download.");
      return;
    }

    try {
      const jsPDFModule = await import("jspdf");//only import when needed.
      const JsPDF = ((jsPDFModule as JSPDFModule).default || (jsPDFModule as JSPDFModule).jsPDF)!;
      const doc = new JsPDF();

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const marginX = 10;
      const maxWidth = pageWidth - marginX * 2;
      let y = 15;
      const lineHeight = 7;

      const addLine = (
        text: string,
        options: { fontSize?: number; bold?: boolean; addGap?: boolean } = {}
      ) => {
        const { fontSize = 11, bold = false, addGap = false } = options;

        if (addGap) y += 3;

        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(fontSize);

        const lines = doc.splitTextToSize(text, maxWidth);

        lines.forEach((line: string) => {
          if (y > pageHeight - 15) {
            doc.addPage();
            y = 15;
          }
          doc.text(line, marginX, y);
          y += lineHeight;
        });
      };

      // Title
      addLine(`AI Fitness Plan for ${data?.name || "User"}`, {
        fontSize: 16,
        bold: true,
      });
      y += 2;

      // Small meta line
      addLine(
        `Goal: ${data?.fitnessGoal || "N/A"}  •  Level: ${data?.fitnessLevel || "N/A"
        }  •  Diet: ${data?.dietaryPreference || "N/A"}`,
        { fontSize: 10 }
      );
      y += 4;

      // Iterate over days
      Object.entries(plan).forEach(([dayKey, content]: [string, DayPlan], index) => {
        y += 2;

        addLine(`Day ${dayKey.replace("day", "")}`, {
          fontSize: 14,
          bold: true,
          addGap: true,
        });

        // Motivation
        if (content.motivation_quote) {
          addLine(`Motivation: ${content.motivation_quote}`, {
            fontSize: 11,
          });
        }

        // Workout
        addLine("Workout:", { fontSize: 12, bold: true, addGap: true });

        content.exercise_plan?.forEach((ex: Exercise) => {
          const sets = ex.sets ?? "-";
          const reps = ex.reps ?? "-";
          const rest = ex.rest ?? "-";
          const group = ex.muscle_group ?? "-";

          addLine(
            `• ${ex.name} — ${sets} sets × ${reps} (Rest: ${rest}, Muscle: ${group})`,
            { fontSize: 11 }
          );

          if (ex.notes) {
            addLine(`   Notes: ${ex.notes}`, { fontSize: 10 });
          }
        });

        // Diet
        addLine("Diet:", { fontSize: 12, bold: true, addGap: true });

        ["breakfast", "lunch", "dinner"].forEach((mealKey) => {
          const meal = content.diet_plan[mealKey];
          if (!meal) return;

          const label = mealKey.toUpperCase();
          const item = meal.item ?? "-";
          const calories = meal.calories ?? "-";
          const protein = meal.protein_g ?? "-";

          addLine(
            `${label}: ${item}  —  ${calories} kcal, ${protein}g protein`,
            { fontSize: 11 }
          );

          if (meal.notes) {
            addLine(`   Notes: ${meal.notes}`, { fontSize: 10 });
          }
        });

        // Add a subtle separator between days
        if (index < Object.keys(plan).length - 1) {
          y += 3;
          addLine("──────────────────────────────────────────────", {
            fontSize: 9,
          });
        }
      });

      const filenameSafeName =
        (data?.name || "user").toString().trim().replace(/\s+/g, "_") || "user";

      doc.save(`fitness-plan-${filenameSafeName}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Failed to generate PDF. Check console for details.");
    }
  };
  const handleSaveToLocalStorage = async () => {
    // Don't allow saving already saved plans
    if (isFromSavedPlans) {
      alert("This plan is already saved!");
      return;
    }

    setIsSaving(true);
    setSaveStatus('saving');

    try {
      // Get existing plans
      const existing = localStorage.getItem("fitnessPlans");
      const plansArray = existing ? JSON.parse(existing) : [];

      // Create a new plan object
      const newPlan = {
        id: crypto.randomUUID(), // unique ID for each saved plan
        userData: data,
        plan,
        generatedAt: new Date().toISOString()
      };

      // Append and save
      const updatedPlans = [newPlan, ...plansArray];
      localStorage.setItem("fitnessPlans", JSON.stringify(updatedPlans));

      setSaveStatus('saved');

      // Reset to "Save Plan" after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);

    } catch (error) {
      console.error("Local storage error:", error);
      setSaveStatus('error');

      // Reset to "Save Plan" after 2 seconds on error too
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } finally {
      setIsSaving(false);
    }
  };
  const handleListenToPlan = async (day: string, content: DayPlan) => {
  try {
    // --- If currently playing this day → PAUSE it ---
    if (currentPlayingDay === day && audioPlayer) {
      audioPlayer.pause();
      setCurrentPlayingDay(null);
      return;
    }

    // --- If audio already cached → PLAY directly ---
    if (audioCache[day]) {
      const audio = new Audio(audioCache[day]);
      audio.play();
      setAudioPlayer(audio);
      setCurrentPlayingDay(day);
      return;
    }

    // --- Otherwise generate audio ---
    setLoadingAudio(prev => ({ ...prev, [day]: true }));

    const ttsText = `
      Workout Plan:
      ${content.exercise_tts_prompt}

      Diet Plan:
      ${content.diet_tts_prompt}
    `;

    const res = await fetch("/api/generate-audio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: ttsText }),
    });

    const data = await res.json();

    if (!data.audioBase64) {
      throw new Error("TTS failed");
    }

    // --- Convert base64 to playable audio ---
    const audioBlob = new Blob(
      [Uint8Array.from(atob(data.audioBase64), c => c.charCodeAt(0))],
      { type: "audio/mpeg" }
    );
    const audioUrl = URL.createObjectURL(audioBlob);

    // --- Cache the audio locally ---
    setAudioCache(prev => ({ ...prev, [day]: audioUrl }));

    // --- Play it ---
    const audio = new Audio(audioUrl);
    audio.play();
    setAudioPlayer(audio);
    setCurrentPlayingDay(day);

  } catch (err) {
    console.error("TTS Error:", err);
    alert("Failed to generate audio");
  } finally {
    setLoadingAudio(prev => ({ ...prev, [day]: false }));
  }
};

  const generateTranscript = (day: string, content: DayPlan): string => {
    return `${content.exercise_tts_prompt} ${content.diet_tts_prompt}`;
  };
  const generateTTSAudio = async (text: string) => {
    const response = await fetch("/api/generate-audio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const result = await response.json();

    const audioBlob = new Blob(
      [Uint8Array.from(atob(result.audioBase64), c => c.charCodeAt(0))],
      { type: "audio/mpeg" }
    );

    return URL.createObjectURL(audioBlob);
  };

  const handleGenerateImage = async (type: 'exercise' | 'meal', name: string, day: string, identifier: string) => {
    // Create unique key for this image (day + type + name)
    const imageKey = `${day}-${type}-${identifier}`;

    // If image already exists, do nothing
    if (generatedImages[imageKey]) return;

    setGeneratingImages(prev => ({ ...prev, [imageKey]: true }));

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: name,
          type: type
        }),
      });

      if (!response.ok) {
        throw new Error('Image generation failed');
      }

      const data = await response.json();

      // Store the generated image URL
      setGeneratedImages(prev => ({ ...prev, [imageKey]: data.imageUrl }));

    } catch (error) {
      console.error('Image generation error:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setGeneratingImages(prev => ({ ...prev, [imageKey]: false }));
    }
  };

  useEffect(() => {
    return () => {
      // Clean up all audio instances
      Object.values(audioInstances).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);
  useEffect(() => {
    return () => {
      // Clear any ongoing image generations if needed
      setGeneratingImages({});
    };
  }, []);
  if (loading) return <GeneratingScreen />;

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-foreground">Plan Generation Failed</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="bg-card border border-border rounded-2xl p-4 text-left">
            <p className="text-sm font-medium text-foreground mb-2">Submitted Data:</p>
            <pre className="text-xs text-muted-foreground overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No plan generated.</p>
        </div>
      </div>
    );
  }
  // console.log("plan: ", plan)

  return (
    <div className="font-sans min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-foreground inline">
            Hey,
            <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" " + data.name}
            </span>
          </h1>

          <p className="text-muted-foreground text-md max-w-2xl mx-auto mb-8">
            Your complete workout and nutrition plan tailored specifically for your goals is ready.
          </p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {/* Regenerate Plan Button */}
            <motion.button
              onClick={handleRegeneratePlan}
              disabled={isRegenerating}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${isRegenerating ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              {isRegenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Regenerate Plan
                </>
              )}
            </motion.button>

            {/* Download PDF Button */}
            <motion.button
              onClick={handleDownloadPDF}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-linear-to-r from-blue-500 to-cyan-500 text-white font-semibold transition-all duration-300 hover:shadow-lg cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </motion.button>

            {/* Save to Local Storage Button */}
            <motion.button
              onClick={handleSaveToLocalStorage}
              disabled={isSaving || saveStatus === 'saved'}
              whileHover={!isSaving && saveStatus === 'idle' ? { scale: 1.05 } : {}}
              whileTap={!isSaving && saveStatus === 'idle' ? { scale: 0.95 } : {}}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 hover:shadow-lg ${saveStatus === 'saved'
                ? 'bg-green-600 text-white cursor-default'
                : saveStatus === 'error'
                  ? 'bg-red-500 text-white cursor-pointer'
                  : 'bg-linear-to-r from-green-500 to-emerald-500 text-white cursor-pointer'
                } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {saveStatus === 'saving' ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Saving...
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  Saved
                  <CheckCircle2 className="w-4 h-4" />
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <AlertCircle className="w-4 h-4" />
                  Save Failed
                </>
              ) : isFromSavedPlans === true ? (
                <>
                  <Save className="w-4 h-4" />

                  Saved
                  <CheckCircle2 className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Plan
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Days Grid */}
        <div className="space-y-8">
          {Object.entries(plan).map(([day, content]: [string, DayPlan], index) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-3xl px-8 py-4 shadow-lg"
            >
              {/* Day Header */}
              <div className="flex items-center gap-4 mb-4 pb-3 border-b border-border/50">
                <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground capitalize">
                    {day.replace("day", "Day ")}
                  </h2>
                  <p className="text-muted-foreground">Complete daily fitness plan</p>
                </div>
                <div className="ml-auto">
                  <motion.button
                    onClick={() => handleListenToPlan(day, content)}
                    disabled={loadingAudio[day]}
                    className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {loadingAudio[day] ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full "
                        />
                        Generating Audio...
                      </>
                    ) : currentPlayingDay === day ? (
                      <>
                        <VolumeOff className="w-4 h-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        Listen to Plan
                      </>
                    )}
                  </motion.button>
                  {/* <Volume2 className="w-12 h-12 text-blue-500 p-1" /> */}
                </div>
              </div>

              {/* Motivation Quote */}
              <div className="bg-linear-to-r from-blue-500/5 to-cyan-500/5 border border-blue-500/20 rounded-2xl px-6 py-3 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-foreground/80 text-lg leading-relaxed font-semibold">
                      {content.motivation_quote}
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Content Grid - Equal Height Columns */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Workout Plan - Left Side */}
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Dumbbell className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">Workout Plan</h3>
                        <p className="text-muted-foreground">Strength & Conditioning</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 flex-1">
                    {content.exercise_plan?.map((exercise: Exercise, exIndex: number) => (
                      <motion.div
                        key={exIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + exIndex * 0.05 }}
                        className="bg-linear-to-br from-blue-50 to-blue-50 dark:from-blue-950/20 dark:to-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-2xl px-5 py-2 hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-foreground text-lg group-hover:text-blue-600 transition-colors">
                              {exercise.name}
                            </h4>
                            <span className="inline-block px-2 bg-blue-500/10 text-blue-500 text-xs rounded-full font-medium">
                              {exercise.muscle_group}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div className="text-center bg-white dark:bg-gray-800 rounded-xl px-3 py-1 shadow-sm flex flex-col items-center justify-center">
                            <p className="text-2xl font-bold text-blue-600">{exercise.sets}</p>
                            <p className="text-xs text-muted-foreground font-medium">Sets</p>
                          </div>
                          <div className="text-center bg-white dark:bg-gray-800 rounded-xl px-3 py-1 shadow-sm flex flex-col items-center justify-center">
                            <p className="text-2xl font-bold text-blue-600">{exercise.reps}</p>
                            <p className="text-xs text-muted-foreground font-medium">Reps</p>
                          </div>
                          <div className="text-center bg-white dark:bg-gray-800 rounded-xl px-3 py-1 shadow-sm flex flex-col items-center justify-center">
                            <div className="flex items-center justify-center gap-1">
                              <p className="text-lg font-bold text-blue-600">{exercise.rest}</p>
                            </div>
                            <p className="text-xs text-muted-foreground font-medium">Rest</p>
                          </div>
                          <div className="text-center bg-white dark:bg-gray-800 rounded-xl shadow-sm flex flex-col items-center justify-center">
                            {generatingImages[`${day}-exercise-${exercise.name}`] ? (
                              <div className="flex flex-col items-center justify-center h-full">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mb-1"
                                />
                                <p className="text-xs text-muted-foreground">Generating...</p>
                              </div>
                            ) : generatedImages[`${day}-exercise-${exercise.name}`] ? (
                              <motion.img
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={generatedImages[`${day}-exercise-${exercise.name}`]}
                                alt={exercise.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <motion.button
                                onClick={() => handleGenerateImage('exercise', exercise.name, day, exercise.name)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-blue-500 hover:text-blue-600 transition-colors text-sm font-medium"
                              >
                                Get Image
                              </motion.button>
                            )}
                          </div>

                        </div>

                        {exercise.notes && (
                          <div className="bg-blue-100/50 dark:bg-gray-800 rounded-xl px-3 py-1  dark:border-blue-800">
                            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                              {exercise.notes}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Nutrition Plan - Right Side */}
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-linear-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Apple className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">Nutrition Plan</h3>
                        <p className="text-muted-foreground">Fuel Your Performance</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 flex-1">
                    {["breakfast", "lunch", "dinner"].map((meal, mealIndex) => {
                      const mealData = content.diet_plan?.[meal];
                      if (!mealData) return null;

                      const mealIcons = {
                        breakfast: <Utensils className="w-5 h-5 text-yellow-500" />,
                        lunch: <Carrot className="w-5 h-5 text-green-500" />,
                        dinner: <Flame className="w-5 h-5 text-orange-500" />
                      };

                      const mealColors = {
                        breakfast: "from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-yellow-200 dark:border-yellow-800",
                        lunch: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800",
                        dinner: "from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20 border-orange-200 dark:border-orange-800"
                      };

                      return (
                        <motion.div
                          key={meal}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + mealIndex * 0.05 }}
                          className={`bg-linear-to-br ${mealColors[meal as keyof typeof mealColors]} rounded-2xl p-5 hover:shadow-lg transition-all duration-300 group`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h4 className="font-bold text-foreground text-lg capitalize group-hover:text-green-600 transition-colors">
                                {meal}
                              </h4>
                              <p className="text-foreground mt-2 text-lg font-medium">{mealData.item}</p>
                            </div>
                            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                              {mealIcons[meal as keyof typeof mealIcons]}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm flex justify-center items-center flex-col ">
                              <div className="flex items-center justify-center ">
                                <p className="text-xl font-bold text-blue-600">{mealData.calories}</p>
                              </div>
                              <p className="text-xs text-muted-foreground font-medium">Calories</p>
                            </div>
                            <div className="text-center bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm flex justify-center items-center flex-col ">
                              <p className="text-xl font-bold text-blue-600">{mealData.protein_g}g</p>
                              <p className="text-xs text-muted-foreground font-medium">Protein</p>
                            </div>
                            <div className="text-center bg-white dark:bg-gray-800 rounded-xl shadow-sm flex flex-col items-center justify-center">
                              {generatingImages[`${day}-meal-${mealData.item}`] ? (
                                <div className="flex flex-col items-center justify-center h-full">
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full mb-1"
                                  />
                                  <p className="text-xs text-muted-foreground">Generating...</p>
                                </div>
                              ) : generatedImages[`${day}-meal-${mealData.item}`] ? (
                                <motion.img
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  src={generatedImages[`${day}-meal-${mealData.item}`]}
                                  alt={mealData.item}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <motion.button
                                  onClick={() => handleGenerateImage('meal', mealData.item, day, mealData.item)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="text-green-500 hover:text-green-600 transition-colors text-sm font-medium"
                                >
                                  Get Image
                                </motion.button>
                              )}
                            </div>
                          </div>

                          {mealData.notes && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-green-200 dark:border-green-800">
                              <p className="text-sm text-muted-foreground italic flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">📝</span>
                                {mealData.notes}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Combined Summary Section */}
              <div className="mt-8 pt-8 border-t border-border/50">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Workout Summary */}
                  <div className="bg-linear-to-br from-blue-500/5 to-red-500/5 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-foreground mb-4 flex items-center gap-3">
                      <Dumbbell className="w-5 h-5 text-blue-500" />
                      Workout Summary
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{content.exercise_plan?.length || 0}</p>
                        <p className="text-sm text-muted-foreground font-medium">Exercises</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {content.exercise_plan?.reduce((total: number, ex: Exercise) => total + (parseInt(ex.sets.toString()) || 0), 0)}
                        </p>
                        <p className="text-sm text-muted-foreground font-medium">Total Sets</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {content.exercise_plan?.reduce((total: number, ex: Exercise) => total + (parseInt(ex.reps) || 0) * (parseInt(ex.sets.toString()) || 0), 0)}
                        </p>
                        <p className="text-sm text-muted-foreground font-medium">Total Reps</p>
                      </div>
                    </div>
                  </div>

                  {/* Nutrition Summary */}
                  <div className="bg-linear-to-br from-green-500/5 to-emerald-500/5 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-foreground mb-4 flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Daily Nutrition Summary
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          {Object.values(content.diet_plan || {}).reduce((total: number, meal: Meal) => total + (parseInt(meal.calories) || 0), 0)}
                        </p>
                        <p className="text-sm text-muted-foreground font-medium">Total Calories</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {Object.values(content.diet_plan || {}).reduce((total: number, meal: Meal) => total + (parseInt(meal.protein_g) || 0), 0)}g
                        </p>
                        <p className="text-sm text-muted-foreground font-medium">Protein</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">3</p>
                        <p className="text-sm text-muted-foreground font-medium">Meals</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}