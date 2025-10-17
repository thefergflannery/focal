import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const reviewSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "NEEDS_REVISION"]),
  comments: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // Only editors and admins can review submissions
    if (session.user.role !== "EDITOR" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status, comments } = reviewSchema.parse(body);

    // Await params for Next.js 15
    const { id } = await params;

    // Check if submission exists
    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        editReviews: true,
      },
    });

    if (!submission) {
      return NextResponse.json(
        { success: false, message: "Submission not found" },
        { status: 404 }
      );
    }

    // Create review
    const review = await prisma.editReview.create({
      data: {
        submissionId: id,
        reviewerId: session.user.id,
        status,
        comments,
      },
    });

    // Update submission status
    await prisma.submission.update({
      where: { id },
      data: {
        status:
          status === "APPROVED"
            ? "APPROVED"
            : status === "REJECTED"
              ? "REJECTED"
              : "NEEDS_REVISION",
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
      },
    });

    // If approved, create the actual entry/definition/variant
    if (status === "APPROVED") {
      await processApprovedSubmission(submission);
    }

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Review API error:", error);

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

async function processApprovedSubmission(submission: any) {
  const { type, data } = submission;

  switch (type) {
    case "NEW_ENTRY":
      await createNewEntry(data);
      break;
    case "NEW_DEFINITION":
      await createNewDefinition(data);
      break;
    case "NEW_VARIANT":
      await createNewVariant(data);
      break;
    case "EDIT_ENTRY":
      await editEntry(data);
      break;
    // Add other cases as needed
  }
}

async function createNewEntry(data: any) {
  const { normalize } = await import("@/lib/text-utils");

  const entry = await prisma.entry.create({
    data: {
      headword: data.headword,
      normalized: normalize(data.headword),
      partOfSpeech: data.partOfSpeech,
      etymology: data.etymology,
      notes: data.notes,
    },
  });

  // Create definition if provided
  if (data.definition) {
    await prisma.definition.create({
      data: {
        entryId: entry.id,
        definition: data.definition,
        example: data.example,
      },
    });
  }

  // Link to region if provided
  if (data.regionId) {
    await prisma.entryRegion.create({
      data: {
        entryId: entry.id,
        regionId: data.regionId,
      },
    });
  }
}

async function createNewDefinition(data: any) {
  if (!data.existingEntryId || !data.definition) return;

  await prisma.definition.create({
    data: {
      entryId: data.existingEntryId,
      definition: data.definition,
      example: data.example,
    },
  });
}

async function createNewVariant(data: any) {
  if (!data.existingEntryId || !data.headword) return;

  const { normalize } = await import("@/lib/text-utils");

  await prisma.variant.create({
    data: {
      entryId: data.existingEntryId,
      variant: data.headword,
      normalized: normalize(data.headword),
      pronunciation: data.definition, // Using definition field for pronunciation
      notes: data.notes,
    },
  });
}

async function editEntry(data: any) {
  if (!data.existingEntryId) return;

  const { normalize } = await import("@/lib/text-utils");
  const updateData: any = {};

  if (data.headword) {
    updateData.headword = data.headword;
    updateData.normalized = normalize(data.headword);
  }
  if (data.partOfSpeech) updateData.partOfSpeech = data.partOfSpeech;
  if (data.etymology) updateData.etymology = data.etymology;
  if (data.notes) updateData.notes = data.notes;

  if (Object.keys(updateData).length > 0) {
    await prisma.entry.update({
      where: { id: data.existingEntryId },
      data: updateData,
    });
  }

  // Update definition if provided
  if (data.definition) {
    // This would need more sophisticated logic to determine which definition to update
    // For now, we'll create a new definition
    await prisma.definition.create({
      data: {
        entryId: data.existingEntryId,
        definition: data.definition,
        example: data.example,
      },
    });
  }
}
