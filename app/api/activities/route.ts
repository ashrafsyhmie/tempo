import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const { searchParams } = new URL(request.url)
  const bodyPart = searchParams.get("bodyPart")

  let query = supabase.from("activities").select("*")

  if (bodyPart) {
    query = query.contains("body_parts", [bodyPart])
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
