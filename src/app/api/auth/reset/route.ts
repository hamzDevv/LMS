import { NextResponse } from "next/server";
import { handleResetPassword, validateResetToken } from "@/actions/auth-action";

export async function POST(req: Request) {
  const body = await req.json();

  if (body.type === "validate") {
    const result = await validateResetToken(body.token);
    return NextResponse.json(result);
  }

  if (body.type === "reset") {
    const result = await handleResetPassword(body.token, body.password);
    return NextResponse.json(result);
  }

  return NextResponse.json({ message: "Invalid request" }, { status: 400 });
}