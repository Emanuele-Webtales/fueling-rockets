import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email?: string };
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Server not configured for email check" },
        { status: 501 }
      );
    }

    const admin = createClient(url, serviceRoleKey);
    const { data, error } = await admin.auth.admin.getUserByEmail(email);
    if (error) {
      // If Supabase returns 'User not found', treat as not existing
      if (String(error.message).toLowerCase().includes("not found")) {
        return NextResponse.json({ exists: false });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ exists: Boolean(data?.user) });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
  }
}


