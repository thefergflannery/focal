import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/moderation/suggestions - Get all pending suggestions
export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const suggestions = await prisma.suggestion.findMany({
      where: { status: "PENDING" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        entry: {
          select: {
            id: true,
            headword: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/moderation/suggestions/[id]/review - Review a suggestion
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { suggestionId, status } = await request.json();

    if (!suggestionId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update suggestion status
    const updatedSuggestion = await prisma.suggestion.update({
      where: { id: suggestionId },
      data: {
        status: status,
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
      },
    });

    // If approved, implement the suggestion
    if (status === "APPROVED" || status === "IMPLEMENTED") {
      const suggestion = await prisma.suggestion.findUnique({
        where: { id: suggestionId },
        include: { entry: true },
      });

      if (suggestion && suggestion.entry) {
        // Implement the suggestion based on type
        switch (suggestion.type) {
          case "HEADWORD":
            await prisma.entry.update({
              where: { id: suggestion.entryId },
              data: {
                headword: suggestion.suggestedValue,
                normalized: suggestion.suggestedValue.toLowerCase(),
              },
            });
            break;

          case "DEFINITION":
            // Update the primary definition
            const definition = await prisma.definition.findFirst({
              where: {
                entryId: suggestion.entryId,
                isActive: true,
              },
            });
            if (definition) {
              await prisma.definition.update({
                where: { id: definition.id },
                data: { definition: suggestion.suggestedValue },
              });
            }
            break;

          case "ETYMOLOGY":
            await prisma.entry.update({
              where: { id: suggestion.entryId },
              data: { etymology: suggestion.suggestedValue },
            });
            break;

          case "NOTES":
            await prisma.entry.update({
              where: { id: suggestion.entryId },
              data: { notes: suggestion.suggestedValue },
            });
            break;

          case "PRONUNCIATION":
            // Update pronunciation in variants or add as a note
            await prisma.entry.update({
              where: { id: suggestion.entryId },
              data: {
                notes:
                  `${suggestion.entry.notes || ""}\n\nPronunciation: ${suggestion.suggestedValue}`.trim(),
              },
            });
            break;

          case "USAGE_STATUS":
            await prisma.entry.update({
              where: { id: suggestion.entryId },
              data: { usageStatus: suggestion.suggestedValue as any },
            });
            break;

          case "REGION":
            // Handle region associations - this would require more complex logic
            // to add/remove region associations
            break;
        }
      }
    }

    return NextResponse.json({
      message: "Suggestion reviewed successfully",
      suggestion: updatedSuggestion,
    });
  } catch (error) {
    console.error("Error reviewing suggestion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
