import { NextResponse } from "next/server";
import { fetchSheetTab } from "@/lib/google";

export async function GET() {
  try {
    const activitiesRows = await fetchSheetTab("activities");
    const accomplishmentsRows = await fetchSheetTab("accomplishments");
    const dutyPncoRows = await fetchSheetTab("duty_pnco");
    const compliancesRows = await fetchSheetTab("compliances");

    return NextResponse.json({
      activities_raw: activitiesRows.slice(0, 5),
      activities_row_count: activitiesRows.length,
      accomplishments_raw: accomplishmentsRows.slice(0, 5),
      accomplishments_row_count: accomplishmentsRows.length,
      duty_pnco_raw: dutyPncoRows.slice(0, 5),
      duty_pnco_row_count: dutyPncoRows.length,
      compliances_raw: compliancesRows.slice(0, 3),
      compliances_row_count: compliancesRows.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
