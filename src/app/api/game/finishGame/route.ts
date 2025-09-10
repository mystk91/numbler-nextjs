import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Color, Value } from "@/app/components/game/rectangle/rectangle";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // If the user is logged in, we will update their account's game data
    if (body.user && body.user.session) {
      try {
        //Update their account here
      } catch {
        return NextResponse.json({
          error: "Invalid credentials",
          logout: true, //Indicates user may not be logged in anymore and we should force a logout
        });
      }
    }
    // Here we will update the global stats
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" });
  }
}
