import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Color, Value } from "@/app/components/game/rectangle/rectangle";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // We will update the user's game data here
    const account = true;
    if (!account) {
      return NextResponse.json({
        error: "Invalid credentials",
        logout: true, //Indicates user may not be logged in anymore and we should force a logout
      });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" });
  }
}
