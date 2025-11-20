import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || text.length < 3) {
      return NextResponse.json(
        { error: "Invalid text." },
        { status: 400 }
      );
    }

    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Deepgram API key not found." },
        { status: 500 }
      );
    }

    // ----- CALL DEEPGRAM TTS -----
    const response = await fetch(
      "https://api.deepgram.com/v1/speak?model=aura-asteria-en",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${apiKey}`,
        },
        body: JSON.stringify({ text }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Deepgram TTS failed." },
        { status: 500 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ----- SAVE MP3 LOCALLY -----
    const fileName = `tts-${uuid()}.mp3`;
    const filePath = path.join(process.cwd(), "public", "audio", fileName);

    // Ensure /public/audio exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      audioUrl: `/audio/${fileName}`,
    });
  } catch (error) {
    console.error("TTS ERROR:", error);
    return NextResponse.json(
      { error: "Server error generating TTS." },
      { status: 500 }
    );
  }
}
