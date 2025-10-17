import { NextRequest, NextResponse } from "next/server";
import { searchEntries } from "@/lib/search";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const searchSchema = z.object({
  q: z.string().min(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Rate limiting based on IP
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "anonymous";
    const rateLimit = await checkRateLimit(ip, "search");
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, message: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const { q, limit, offset } = searchSchema.parse({
      q: searchParams.get("q"),
      limit: searchParams.get("limit"),
      offset: searchParams.get("offset"),
    });

    const results = await searchEntries(q, limit, offset);

    return NextResponse.json({
      success: true,
      results,
      query: q,
      limit,
      offset,
      total: results.length,
    });
  } catch (error) {
    console.error("Search API error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid search parameters" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
