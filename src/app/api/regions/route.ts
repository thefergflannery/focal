import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      // Get single region
      const region = await prisma.region.findUnique({
        where: { slug, isActive: true },
        include: {
          entries: {
            include: {
              entry: {
                include: {
                  definitions: {
                    where: { isActive: true },
                    take: 1,
                  },
                  _count: {
                    select: {
                      definitions: true,
                      variants: true,
                    },
                  },
                },
              },
            },
            take: 20,
          },
          _count: {
            select: {
              entries: true,
            },
          },
        },
      });

      if (!region) {
        return NextResponse.json(
          { success: false, message: "Region not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        region,
      });
    } else {
      // Get all regions
      const regions = await prisma.region.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: {
              entries: true,
            },
          },
        },
        orderBy: { name: "asc" },
      });

      return NextResponse.json({
        success: true,
        regions,
      });
    }
  } catch (error) {
    console.error("Regions API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
