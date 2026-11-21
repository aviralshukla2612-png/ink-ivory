import { NextRequest, NextResponse } from "next/server";
import { getPublicTemplateById } from "@/lib/templates/public-templates";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = await getPublicTemplateById(id);
    if (!template) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      data: template,
    });
  } catch (err: any) {
    console.error("GET /api/templates/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch template" },
      { status: 500 }
    );
  }
}
