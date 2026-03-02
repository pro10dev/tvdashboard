import type { Activity, Compliance } from "./types";

/**
 * Compute real-time activity status based on date + time.
 * "Cancelled" from the sheet is always preserved.
 * Otherwise: past date/time = Completed, future = Upcoming.
 */
export function getRealtimeActivityStatus(activity: Activity): Activity["status"] {
  if (activity.status === "Cancelled") return "Cancelled";

  const now = new Date();
  const activityDateTime = parseDateTime(activity.activity_date, activity.activity_time);

  if (!activityDateTime) return activity.status;

  return activityDateTime <= now ? "Completed" : "Upcoming";
}

/**
 * Compute real-time compliance status based on remarks + target_date.
 * - COMPLIED / DISSEMINATED from remarks = complied/disseminated
 * - Otherwise: check target_date vs today for overdue/due_soon/not_complied
 */
export type ComplianceStatus = "not_complied" | "overdue" | "due_soon" | "disseminated" | "complied";

export function getRealtimeComplianceStatus(compliance: Compliance): ComplianceStatus {
  const upper = compliance.remarks.toUpperCase().trim();
  if (upper === "COMPLIED") return "complied";
  if (upper === "DISSEMINATED") return "disseminated";

  if (!compliance.target_date) return "not_complied";

  const today = new Date().toISOString().split("T")[0];
  const target = compliance.target_date;

  if (target < today) return "overdue";

  // Due within 3 days
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  const threshold = threeDaysFromNow.toISOString().split("T")[0];

  if (target <= threshold) return "due_soon";
  return "not_complied";
}

/**
 * Parse "YYYY-MM-DD" + "HH:MM AM/PM" into a Date object.
 */
function parseDateTime(dateStr: string, timeStr: string): Date | null {
  if (!dateStr) return null;

  // Parse date
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return null;

  // Parse time "07:00 PM" or "19:00"
  const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!timeMatch) {
    // No valid time — treat as start of day
    return new Date(y, m - 1, d, 0, 0, 0);
  }

  let [, hStr, minStr, period] = timeMatch;
  let hours = parseInt(hStr, 10);
  const minutes = parseInt(minStr, 10);

  if (period) {
    period = period.toUpperCase();
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
  }

  return new Date(y, m - 1, d, hours, minutes, 0);
}
