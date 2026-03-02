import type { Activity, Accomplishment, Compliance, DutyPNCO, KPIs } from "./types";

function getToday(): string {
  return normalizeDate(new Date().toISOString().split("T")[0]);
}

function normalizeDate(raw: string): string {
  // Handle M/D/YYYY or MM/DD/YYYY → YYYY-MM-DD
  const slashMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const [, m, d, y] = slashMatch;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  return "";
}

function normalizeTime(raw: string): string {
  // Handle "7:00:00 AM" style → "07:00 AM"
  const match = raw.match(/^(\d{1,2}):(\d{2})(:\d{2})?\s*(AM|PM)?$/i);
  if (match) {
    const [, h, m, , period] = match;
    const hour = h.padStart(2, "0");
    return period ? `${hour}:${m} ${period.toUpperCase()}` : `${hour}:${m}`;
  }
  return raw;
}

function isComplied(remarks: string): boolean {
  const upper = remarks.toUpperCase().trim();
  return upper === "COMPLIED" || upper === "DISSEMINATED";
}

export function parseActivities(rows: string[][]): Activity[] {
  if (rows.length < 2) return [];

  const today = getToday();
  const activities: Activity[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 6 || !row[0]?.trim()) continue;

    const status = row[5]?.trim();
    if (status !== "Upcoming" && status !== "Completed" && status !== "Cancelled") continue;

    const activityDate = normalizeDate(row[3]?.trim() ?? "");
    if (!activityDate) continue;

    activities.push({
      id: row[0].trim(),
      activity_name: row[1]?.trim() ?? "",
      attendees: row[2]?.trim() ?? "",
      activity_date: activityDate,
      activity_time: normalizeTime(row[4]?.trim() ?? ""),
      status,
      is_today: activityDate === today,
    });
  }

  const statusOrder: Record<string, number> = { Upcoming: 0, Completed: 1, Cancelled: 2 };
  activities.sort((a, b) => {
    const oa = statusOrder[a.status] ?? 9;
    const ob = statusOrder[b.status] ?? 9;
    if (oa !== ob) return oa - ob;
    return a.activity_date.localeCompare(b.activity_date);
  });
  return activities;
}

export function parseAccomplishments(rows: string[][]): Accomplishment[] {
  if (rows.length < 2) return [];

  const accomplishments: Accomplishment[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 4 || !row[0]?.trim()) continue;

    const date = normalizeDate(row[4]?.trim() ?? "");

    accomplishments.push({
      id: row[0].trim(),
      accomplishment_name: row[1]?.trim() ?? "",
      description: row[2]?.trim() ?? "",
      action_photo_url: row[3]?.trim() ?? "",
      accomplishment_date: date,
    });
  }

  accomplishments.sort((a, b) =>
    b.accomplishment_date.localeCompare(a.accomplishment_date)
  );
  return accomplishments;
}

export function parseCompliances(rows: string[][]): Compliance[] {
  if (rows.length < 2) return [];

  const compliances: Compliance[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 2 || !row[0]?.trim()) continue;

    const targetDate = normalizeDate(row[4]?.trim() ?? "");
    const dateReceived = normalizeDate(row[5]?.trim() ?? "");
    const dateSent = normalizeDate(row[6]?.trim() ?? "");

    compliances.push({
      id: row[0].trim(),
      subject: row[1]?.trim() ?? "",
      category: row[2]?.trim() ?? "",
      action_required: row[3]?.trim() ?? "",
      target_date: targetDate,
      date_received: dateReceived,
      date_sent: dateSent,
      recipient: row[7]?.trim() ?? "",
      remarks: row[8]?.trim() ?? "",
      duty_pnco: row[9]?.trim() ?? "",
    });
  }

  const complianceOrder = (remarks: string): number => {
    const upper = remarks.toUpperCase().trim();
    if (upper === "NOT COMPLIED" || !upper) return 0;
    if (upper === "DISSEMINATED") return 1;
    if (upper === "COMPLIED") return 2;
    return 0;
  };
  compliances.sort((a, b) => {
    const oa = complianceOrder(a.remarks);
    const ob = complianceOrder(b.remarks);
    if (oa !== ob) return oa - ob;
    return a.target_date.localeCompare(b.target_date);
  });
  return compliances;
}

export function parseDutyPNCO(rows: string[][]): DutyPNCO[] {
  if (rows.length < 2) return [];

  const today = getToday();
  const roster: DutyPNCO[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 2 || !row[0]?.trim()) continue;

    const date = normalizeDate(row[0].trim());

    roster.push({
      date,
      pnco_name: row[1]?.trim() ?? "",
      contact_number: row[2]?.trim() ?? "",
      is_today: date === today,
    });
  }

  roster.sort((a, b) => a.date.localeCompare(b.date));
  return roster;
}

export function computeKPIs(
  activities: Activity[],
  accomplishments: Accomplishment[],
  compliances: Compliance[] = []
): KPIs {
  const today = getToday();
  return {
    total_activities: activities.length,
    upcoming_count: activities.filter((a) => a.status === "Upcoming").length,
    completed_count: activities.filter((a) => a.status === "Completed").length,
    total_accomplishments: accomplishments.length,
    total_compliances: compliances.length,
    upcoming_compliances: compliances.filter(
      (c) => c.target_date && c.target_date >= today && !isComplied(c.remarks)
    ).length,
    complied_count: compliances.filter((c) => isComplied(c.remarks)).length,
    not_complied_count: compliances.filter((c) => !isComplied(c.remarks)).length,
  };
}
