import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
// import { normalize } from "@/lib/text-utils" // Not currently used
import { z } from "zod";

const submissionSchema = z.object({
  type: z.enum([
    "NEW_ENTRY",
    "NEW_DEFINITION",
    "NEW_VARIANT",
    "EDIT_ENTRY",
    "EDIT_DEFINITION",
    "EDIT_VARIANT",
    "DELETE_ENTRY",
    "DELETE_DEFINITION",
    "DELETE_VARIANT",
  ]),
  headword: z.string().min(1),
  partOfSpeech: z.string().optional(),
  definition: z.string().optional(),
  example: z.string().optional(),
  etymology: z.string().optional(),
  notes: z.string().optional(),
  existingEntryId: z.string().optional(),
  regionId: z.string().optional(),
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
    const rateLimit = await checkRateLimit(session.user.id, "submit");
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, message: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const data = submissionSchema.parse(body);

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        userId: session.user.id,
        type: data.type,
        status: "PENDING",
        data: {
          headword: data.headword,
          partOfSpeech: data.partOfSpeech,
          definition: data.definition,
          example: data.example,
          etymology: data.etymology,
          notes: data.notes,
          existingEntryId: data.existingEntryId,
          regionId: data.regionId,
        },
        notes: data.notes,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Submission created successfully",
      submissionId: submission.id,
    });
  } catch (error) {
    console.error("Submission API error:", error);

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

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // Only editors and admins can view all submissions
    if (session.user.role !== "EDITOR" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "PENDING";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const submissions = await prisma.submission.findMany({
      where: { status: status as any },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        editReviews: {
          include: {
            reviewer: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
      },
      orderBy: { submittedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.submission.count({
      where: { status: status as any },
    });

    return NextResponse.json({
      success: true,
      submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get submissions API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
