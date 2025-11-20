import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, type } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt missing" }, { status: 400 });
    }

    const apiKey = process.env.STABILITY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing Stability API key" }, { status: 500 });
    }

    // Build a final prompt based on category
    const finalPrompt =
      type === "exercise"
        ? `high quality fitness exercise illustration of ${prompt}, clean background, detailed body, HD`
        : `high quality food photography of ${prompt}, top view, natural light, HD`;

    // Build FormData
    const formData = new FormData();
    formData.append("prompt", finalPrompt);
    formData.append("output_format", "png");

    // Call Stability API
    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("STABILITY ERROR:", errorText);
      return NextResponse.json(
        { error: "Image API failed", detail: errorText },
        { status: 500 }
      );
    }

    const result = await response.json();
    const base64 = result.image;

    const dataUrl = `data:image/png;base64,${base64}`;

    return NextResponse.json({ success: true, imageUrl: dataUrl });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
