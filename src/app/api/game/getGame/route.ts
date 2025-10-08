import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Color, Value } from "@/app/components/game/rectangle/rectangle";
import { connectToDatabase } from "@/app/lib/mongodb";
import { cookies } from "next/headers";

// Returns today's game
async function getTodaysGame(digits: number) {
  try {
    const valuesArr = [];
    const hintsArr = [];
    for (let i = 0; i < 6; i++) {
      const valueRow: Value[] = [];
      const hintRow: Color[] = [];
      for (let j = 0; j < digits + 1; j++) {
        valueRow.push("");
        hintRow.push(`none`);
      }
      valuesArr.push(valueRow);
      hintsArr.push(hintRow);
    }
    const gameStatus = "playing";
    const currentRow = 0;
    const db = await connectToDatabase(`daily_games`);
    const dailyGames = db.collection(`daily_games`);
    const todaysGame = await dailyGames.findOne({ digits: digits });
    if (!todaysGame) {
      throw new Error();
    }
    const game = {
      values: valuesArr,
      hints: hintsArr,
      date: todaysGame.date,
      gameStatus: gameStatus,
      currentRow: currentRow,
      correctNumber: todaysGame.correctNumber,
      gameId: todaysGame.gameId,
    };
    return game;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const digits = Math.max(2, Number(body.digits));
    const todaysGame = await getTodaysGame(digits);
    if (!todaysGame) {
      throw new Error(`Game not found`);
    }
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;
    if (sessionId) {
      // Here we will retrieve users current game from their account
      // If they have an old game, we will send them that
      // Otherwise we will send them today's puzzle
      const accountsDb = await connectToDatabase("accounts");
      const accounts = accountsDb.collection("accounts");
      const account = await accounts.findOne({ sessionId: sessionId });
      if (!account) throw new Error("Invalid credentials");
      const currentGame = account[`${digits}digits`];
      if (!currentGame) {
        await accounts.updateOne(
          { sessionId: sessionId },
          { $set: { [`${digits}digits`]: todaysGame } }
        );
        return NextResponse.json({
          game: todaysGame,
          scores: account[`${digits}scores`],
        });
      }
      if (
        currentGame.gameId === todaysGame.gameId ||
        currentGame.gameStatus === "playing"
      ) {
        return NextResponse.json({
          game: currentGame,
          scores: account[`${digits}scores`],
        });
      }
      return NextResponse.json({
        game: todaysGame,
        scores: account[`${digits}scores`],
      });
    } else {
      // LocalStorage version
      // We just need to send today's new game if they don't have it already
      if (body.game.gameId === todaysGame.gameId) {
        // They do have today's game already, so we send their game back to them
        return NextResponse.json({ game: body.game });
      }
      return NextResponse.json({ game: todaysGame });
    }
  } catch (error) {
    if (error === "Invalid credentials") {
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
