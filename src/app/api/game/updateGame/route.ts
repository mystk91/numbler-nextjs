import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { cookies } from "next/headers";
import zod from "zod";
import { descramble } from "@/app/lib/descramble";

const GameStatusSchema = zod.enum(["playing", "victory", "defeat"]);
const CurrentRowSchema = zod.number().int().min(0).max(5);
const DigitsSchema = zod.number().int().min(2).max(7);
const ScoreScheme = zod.number().int().min(1).max(7);
const GameIdSchema = zod.string().max(20);
const DateSchema = zod.date();
const NumberValues = zod.union([
  zod.number().int().min(0).max(9),
  zod.enum([""]),
]);
const HintValues = zod.enum(["lower, higher, equals"]);
const HintColors = zod.enum([
  "none",
  "green",
  "yellow",
  "grey",
  "higher",
  "lower",
]);

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;
  try {
    if (!sessionId) throw new Error("Invalid credentials");
    const body = await req.json();
    const game = body.game;
    const digits = body.digits;
    const descrambled = descramble(game.correctNumber);
    // We need to check that the GameData is valid
    if (
      !GameStatusSchema.safeParse(game.gameStatus) ||
      !CurrentRowSchema.safeParse(game.currentRow) ||
      !GameIdSchema.safeParse(game.gameId) ||
      !DateSchema.safeParse(new Date(game.date)) ||
      !DigitsSchema.safeParse(digits) ||
      descrambled.length != digits
    ) {
      throw new Error();
    }
    // Here we are checking the "digit" values
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < digits; j++) {
        if (
          !NumberValues.safeParse(
            game.values[i][j] || !HintColors.safeParse(game.hints[i][j])
          )
        ) {
          throw new Error();
        }
      }
    }
    // Here we are checking the directional "hint" values
    for (let i = 0; i < 6; i++) {
      if (
        !HintValues.safeParse(
          game.values[i][digits] ||
            !HintColors.safeParse(game.values[i][digits])
        )
      ) {
        throw new Error();
      }
    }
    const gameUpdate = {
      values: game.values,
      hints: game.hints,
      date: game.date,
      gameStatus: game.gameStatus,
      currentRow: game.currentRow,
      correctNumber: game.correctNumber,
      gameId: game.gameId,
    };
    // Updating the game data in backend
    const accountsDb = await connectToDatabase("accounts");
    const accounts = accountsDb.collection("accounts");
    let result;
    // If they have a body.score, it means the just finished a game
    if (body.score) {
      const score = body.score;
      if (!ScoreScheme.safeParse(score)) throw new Error();
      result = await accounts.updateOne(
        { sessionId: sessionId },
        {
          $set: {
            [`digits${digits}`]: gameUpdate,
            lastActive: new Date(),
          },
          $push: { [`scores${digits}`]: score },
        }
      );
    } else {
      result = await accounts.updateOne(
        { sessionId: sessionId },
        { $set: { [`digits${digits}`]: gameUpdate } }
      );
    }
    if (!result || !result.acknowledged) {
      throw new Error();
    }
    if (result.matchedCount === 0) {
      throw new Error("Invalid credentials");
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid credentials") {
      cookieStore.delete("sessionId");
      return NextResponse.json({
        error: "Invalid credentials",
        logout: true, //Indicates user may not be logged in anymore and we should force a logout
      });
    } else {
      return NextResponse.json({ error: "Something went wrong" });
    }
  }
}
