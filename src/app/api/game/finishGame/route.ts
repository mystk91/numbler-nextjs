import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import zod from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const DigitsSchema = zod.number().int().min(2).max(7);
    const ScoreScheme = zod.number().int().min(1).max(7);
    const GameIdSchema = zod.string().max(20);
    if (
      !DigitsSchema.safeParse(body.digits) ||
      !ScoreScheme.safeParse(body.score) ||
      !GameIdSchema.safeParse(body.gameId)
    ) {
      throw new Error();
    }
    const daily_games_db = await connectToDatabase("daily_games");
    const daily_games = daily_games_db.collection("daily_games");
    const todaysGame = await daily_games.findOne({ gameId: body.gameId });
    const analytics = await connectToDatabase("analytics");
    const game_stats = analytics.collection<Record<string, any>>("game_stats");
    await game_stats.updateOne(
      { digits: body.digits },
      {
        $push: { scores: body.score },
      },
      { upsert: true }
    );
    if (todaysGame && todaysGame.gameId === body.gameId) {
      return NextResponse.json({ newGame: false });
    } else {
      return NextResponse.json({ newGame: true });
    }
  } catch {
    return NextResponse.json({ error: "Something went wrong" });
  }
}
