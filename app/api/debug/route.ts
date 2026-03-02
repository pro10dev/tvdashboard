import { NextResponse } from "next/server";
import { fetchSheetTab } from "@/lib/google";

export async function GET() {
  try {
    const activitiesRows = await fetchSheetTab("activities");
    const accomplishmentsRows = await fetchSheetTab("accomplishments");

    return NextResponse.json({
      activities_raw: activitiesRows.slice(0, 5),
      activities_row_count: activitiesRows.length,
      accomplishments_raw: accomplishmentsRows.slice(0, 5),
      accomplishments_row_count: accomplishmentsRows.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
