import { fetchSheetTab } from "@/lib/google";
import { parseActivities, parseAccomplishments, parseCompliances, parseDutyPNCO, computeKPIs } from "@/lib/transform";
import type { DashboardData } from "@/lib/types";
import Dashboard from "@/components/Dashboard";
import ErrorBoundary from "@/components/ErrorBoundary";

async function getDashboardData(): Promise<DashboardData> {
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

  return {
    kpis,
    activities,
    accomplishments,
    compliances,
    duty_pnco,
    fetched_at: new Date().toISOString(),
  };
}

export const dynamic = "force-dynamic";

export default async function Home() {
  let data: DashboardData;

  try {
    data = await getDashboardData();
  } catch {
    data = {
      kpis: { total_activities: 0, upcoming_count: 0, completed_count: 0, total_accomplishments: 0, total_compliances: 0, upcoming_compliances: 0, complied_count: 0, not_complied_count: 0 },
      activities: [],
      accomplishments: [],
      compliances: [],
      duty_pnco: [],
      fetched_at: new Date().toISOString(),
    };
  }

  const tabRotateMinutes = parseFloat(process.env.TAB_ROTATE_MINUTES || "0.5");
  const refreshMinutes = parseFloat(process.env.REFRESH_MINUTES || "5");
  const dutyShiftTime = process.env.DUTY_SHIFT_TIME || "08:00";

  return (
    <ErrorBoundary>
      <Dashboard initialData={data} tabRotateMinutes={tabRotateMinutes} refreshMinutes={refreshMinutes} dutyShiftTime={dutyShiftTime} />
    </ErrorBoundary>
  );
}
