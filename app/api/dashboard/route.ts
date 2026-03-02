import { NextResponse } from "next/server";
import { fetchSheetTab } from "@/lib/google";
import { parseActivities, parseAccomplishments, parseCompliances, parseDutyPNCO, computeKPIs } from "@/lib/transform";
import type { DashboardData } from "@/lib/types";

export async function GET() {
  try {
    const [activitiesRows, accomplishmentsRows, compliancesRows, dutyPncoRows] = await Promise.all([
      fetchSheetTab("activities"),
      fetchSheetTab("accomplishments"),
      fetchSheetTab("compliances"),
      fetchSheetTab("duty_pnco"),
    ]);

    const activities = parseActivities(activitiesRows);
    const accomplishments = parseAccomplishments(accomplishmentsRows);
    const compliances = parseCompliances(compliancesRows);
    const duty_pnco = parseDutyPNCO(dutyPncoRows);
    const kpis = computeKPIs(activities, accomplishments, compliances);

    const data: DashboardData = {
      kpis,
      activities,
      accomplishments,
      compliances,
      duty_pnco,
      fetched_at: new Date().toISOString(),
    };

    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch dashboard data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
