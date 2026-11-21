import { NextRequest, NextResponse } from "next/server";
import { getPublicTemplates } from "@/lib/templates/public-templates";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const templates = await getPublicTemplates();
    return NextResponse.json({
      success: true,
      data: templates,
    });
  } catch (err: any) {
    console.error("GET /api/templates error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}
