import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Color, Value } from "@/app/components/game/rectangle/rectangle";

function generateString(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < length; i++) {
    result += characters.charAt(bytes[i] % characters.length);
  }
  return result;
}

//Creates a new game with an empty board
function createNewGame(digits: number) {
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
  const date = new Date();
  const gameStatus = "playing";
  const currentRow = 0;
  const gameId = `${digits}${generateString(4)}`;
  // We need to retrieve the correct number and date for the current puzzle
  // Just creating a random number for now
  let correctNumber = "";
  for (let i = 0; i < digits; i++) {
    correctNumber += Math.floor(Math.random() * 10);
  }
  const game = {
    values: valuesArr,
    hints: hintsArr,
    date: date,
    gameStatus: gameStatus,
    currentRow: currentRow,
    correctNumber: correctNumber,
    gameId: gameId,
  };
  return game;
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

      /* This is a temporary test for what happens when user has already completed today's game
      if (body.game.gameStatus !== "playing") {
        return NextResponse.json({ game: body.game });
      }
      */

      // Here we are mocking retreiving a new daily game
      const digits = Math.max(2, Number(body.digits));
      const game = createNewGame(digits);
      return NextResponse.json({ game: game });
    }
  } catch {
    return NextResponse.json({ error: "Something went wrong" });
  }
}
