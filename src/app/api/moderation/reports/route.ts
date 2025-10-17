import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/moderation/reports - Get all pending reports
export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reports = await prisma.report.findMany({
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
        definition: {
          select: {
            id: true,
            definition: true,
          },
        },
        variant: {
          select: {
            id: true,
            variant: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/moderation/reports/[id]/review - Review a report
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reportId, status } = await request.json();

    if (!reportId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update report status
    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: {
        status: status,
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
      },
    });

    // If resolved, take appropriate action based on report reason
    if (status === "RESOLVED") {
      const report = await prisma.report.findUnique({
        where: { id: reportId },
        include: {
          entry: true,
          definition: true,
          variant: true,
        },
      });

      if (report) {
        switch (report.reason) {
          case "INAPPROPRIATE":
          case "INCORRECT":
            // Deactivate the content
            if (report.entryId) {
              await prisma.entry.update({
                where: { id: report.entryId },
                data: { isActive: false },
              });
            }
            if (report.definitionId) {
              await prisma.definition.update({
                where: { id: report.definitionId },
                data: { isActive: false },
              });
            }
            if (report.variantId) {
              await prisma.variant.update({
                where: { id: report.variantId },
                data: { isActive: false },
              });
            }
            break;

          case "DUPLICATE":
            // Mark for potential merging or deletion
            // This would require additional logic to handle duplicates
            break;

          case "SPAM":
            // Remove spam content
            if (report.entryId) {
              await prisma.entry.delete({ where: { id: report.entryId } });
            }
            break;
        }
      }
    }

    return NextResponse.json({
      message: "Report reviewed successfully",
      report: updatedReport,
    });
  } catch (error) {
    console.error("Error reviewing report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
