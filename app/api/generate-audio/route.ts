import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || text.length < 3) {
      return NextResponse.json({ error: "Invalid text." }, { status: 400 });
    }

    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Deepgram API key missing on server." },
        { status: 500 }
      );
    }

    // ----- CALL DEEPGRAM -----
    const response = await fetch(
      "https://api.deepgram.com/v1/speak?model=aura-asteria-en",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${apiKey}`,
        },
        body: JSON.stringify({ text }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log("DEEPGRAM ERROR:", errorText);
      return NextResponse.json(
        { error: "Deepgram TTS failed." },
        { status: 500 }
      );
    }

    // Convert audio stream → base64 to send to client
    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");

    return NextResponse.json({
      audioBase64: base64Audio,
    });
  } catch (err) {
    console.error("TTS API ERROR:", err);
    return NextResponse.json(
      { error: "Server error generating audio." },
      { status: 500 }
    );
  }
}
