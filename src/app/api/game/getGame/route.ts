import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Color, Value } from "@/app/components/game/rectangle/rectangle";
import { connectToDatabase } from "@/app/lib/mongodb";

//Creates a new game with an empty board
async function createNewGame(digits: number) {
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
    if (body.user && body.user.session) {
      // Here we will retrieve users current game from their account
      // If they have an old game, we will send them that
      // Otherwise we will send them today's puzzle
      try {
      } catch {
        return NextResponse.json({
          error: "Invalid credentials",
          logout: true, //Indicates user may not be logged in anymore and we should force a logout
        });
      }
    } else {
      // LocalStorage version
      // If the user's current game is the latest daily game, we need to simply return what they sent us


      
      // Here we are mocking retreiving a new daily game
      const digits = Math.max(2, Number(body.digits));
      const game = await createNewGame(digits);
      if (!game) {
        throw new Error(`Game not found`);
      }
      return NextResponse.json({ game: game });
    }
  } catch {
    return NextResponse.json({ error: "Something went wrong" });
  }
}
