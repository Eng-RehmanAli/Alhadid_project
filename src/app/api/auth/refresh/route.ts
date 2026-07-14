import { NextResponse } from "next/server";
import { refreshAccessToken } from "@/lib/session";

export async function POST() {
  const user = await refreshAccessToken();
  if (!user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({
    ok: true,
    user: { id: user.id, name: user.name, email: user.email },
  });
}
