import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { cookies } from "next/headers";
import zod from "zod";

export async function DELETE(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;
  try {
    const body = await req.json();
    const DigitsSchema = zod.number().int().min(2).max(7);
    if (!body.digits || body.digits.length < 1) throw new Error();
    body.digits.forEach((digit: number) => {
      if (!DigitsSchema.safeParse(digit)) {
        throw new Error();
      }
    });
    if (!sessionId) {
      throw "Invalid credentials";
    }
    const db = await connectToDatabase("accounts");
    const accounts = db.collection("accounts");
    const fields: any = {};
    body.digits.forEach((digit: number) => {
      fields[`scores${digit}`] = "";
    });
    const result = await accounts.updateOne(
      { sessionId: sessionId },
      { $unset: fields }
    );
    if (!result || !result.acknowledged) {
      throw new Error();
    }
    if (result.matchedCount === 0) {
      throw "Invalid credentials";
    }
    return NextResponse.json({ success: true });
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
