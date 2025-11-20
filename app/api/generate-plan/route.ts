import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate required fields
    const requiredFields = [
      "name", "age", "gender", "height", "weight",
      "fitnessGoal", "fitnessLevel", "workoutLocation",
      "dietaryPreference", "stressLevel"
    ];

    const missing = requiredFields.filter(f => !body[f]);
    if (missing.length > 0) {
      return NextResponse.json(
        { error: "Missing fields: " + missing.join(", ") },
        { status: 400 }
      );
    }

    // Create client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    const prompt = `
You are an AI fitness expert and mindset coach.

Generate a STRICT JSON weekly fitness plan for this user:
${JSON.stringify(body, null, 2)}

RETURN EXACTLY THIS JSON SHAPE:

{
  "day1": {
    "exercise_plan": [
      { "name":"", "sets":0, "reps":"", "rest":"", "muscle_group":"", "notes":"" }
    ],
    "diet_plan": {
      "breakfast": { "item":"", "calories":0, "protein_g":0 },
      "lunch": { "item":"", "calories":0, "protein_g":0 },
      "dinner": { "item":"", "calories":0, "protein_g":0 }
    },
    "exercise_tts_prompt": "",
    "diet_tts_prompt": "",
    "exercise_image_prompt": "",
    "diet_image_prompt": "",
    "motivation_quote": ""
  },
  ...
  "day7": { ... }
}

--- RULES FOR MOTIVATION QUOTES ---
• Personalize the quote based on gender:
  male → strong, disciplined tone  
  female → empowering, confident tone  
  other → neutral inspiring tone  

• Personalize based on diet type:
  vegetarian → plant-powered mindset  
  non-vegetarian → protein-fuel mindset  
  vegan → clean-fuel mindset  
  keto / mediterranean / paleo → reflect food lifestyle  

• Personalize based on fitness goal:
  weight-loss → consistency & discipline  
  muscle-gain → strength & progress  
  endurance → stamina & push limits  
  flexibility → calm & mindful  
  rehab → gentle motivation  

• Stress level influences tone:
  low → normal motivational tone  
  moderate → balanced, calm encouragement  
  high → soft supportive tone  
  very-high → very gentle reassurance  

• The quote should be 1–2 enthusiastic lines ONLY.
• NO markdown.
• NO extra text.
• ONLY JSON in final output.
`;


    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: 5000
      }
    });

    const raw = result.response.text();

    let json;
    try {
      json = JSON.parse(raw);
    } catch (err) {
      console.log(err);
      return NextResponse.json(
        { error: "Invalid AI JSON", raw },
        { status: 500 }
      );
    }

    return NextResponse.json({ week_plan: json });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err || "Server error" },
      { status: 500 }
    );
  }
}
