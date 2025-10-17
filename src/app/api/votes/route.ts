import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { voteDefinition } from "@/lib/votes";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const voteSchema = z.object({
  definitionId: z.string().min(1),
  isUpvote: z.boolean(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // Rate limiting
    const rateLimit = await checkRateLimit(session.user.id, "vote");
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, message: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { definitionId, isUpvote } = voteSchema.parse(body);

    const result = await voteDefinition(
      session.user.id,
      definitionId,
      isUpvote
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Vote API error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid request data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
