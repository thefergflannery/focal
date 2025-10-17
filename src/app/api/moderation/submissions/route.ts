import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/moderation/submissions - Get all pending submissions
export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const submissions = await prisma.submission.findMany({
      where: { status: "PENDING" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/moderation/submissions/[id]/review - Review a submission
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { submissionId, status, comments } = await request.json();

    if (!submissionId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update submission status
    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: status,
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
      },
    });

    // Create edit review record
    await prisma.editReview.create({
      data: {
        submissionId: submissionId,
        reviewerId: session.user.id,
        status: status,
        comments: comments || null,
      },
    });

    // If approved, implement the changes
    if (status === "APPROVED") {
      const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        include: { user: true },
      });

      if (submission && submission.data) {
        const data = submission.data as any;

        // Handle different submission types
        switch (submission.type) {
          case "NEW_ENTRY":
            // Create new entry
            await prisma.entry.create({
              data: {
                headword: data.headword,
                normalized: data.normalized || data.headword.toLowerCase(),
                partOfSpeech: data.partOfSpeech,
                etymology: data.etymology,
                notes: data.notes,
                audioUrl: data.audioUrl,
                usageStatus: data.usageStatus || "CURRENT",
              },
            });
            break;

          case "NEW_DEFINITION":
            // Add definition to existing entry
            if (data.entryId) {
              await prisma.definition.create({
                data: {
                  entryId: data.entryId,
                  definition: data.definition,
                  example: data.example,
                  notes: data.notes,
                },
              });
            }
            break;

          case "NEW_VARIANT":
            // Add variant to existing entry
            if (data.entryId) {
              await prisma.variant.create({
                data: {
                  entryId: data.entryId,
                  variant: data.variant,
                  normalized: data.normalized || data.variant.toLowerCase(),
                  pronunciation: data.pronunciation,
                  notes: data.notes,
                },
              });
            }
            break;
        }
      }
    }

    return NextResponse.json({
      message: "Submission reviewed successfully",
      submission: updatedSubmission,
    });
  } catch (error) {
    console.error("Error reviewing submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
