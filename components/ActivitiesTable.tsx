import type { Activity } from "@/lib/types";

interface ActivitiesTableProps {
  activities: Activity[];
}

export default function ActivitiesTable({ activities }: ActivitiesTableProps) {
  const display = activities.slice(0, 8);

  return (
    <div className="px-10 py-2 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="border-b border-border/60 text-left">
            <th
              className="w-[36%] py-3 pr-4 text-base font-bold tracking-[0.1em] text-muted/70 uppercase"
              style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
            >
              Activity
            </th>
            <th
              className="w-[14%] py-3 pr-4 text-base font-bold tracking-[0.1em] text-muted/70 uppercase"
              style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
            >
              Date
            </th>
            <th
              className="w-[12%] py-3 pr-4 text-base font-bold tracking-[0.1em] text-muted/70 uppercase"
              style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
            >
              Time
            </th>
            <th
              className="w-[13%] py-3 pr-4 text-base font-bold tracking-[0.1em] text-muted/70 uppercase"
              style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
            >
              Attendees
            </th>
            <th
              className="w-[25%] py-3 text-base font-bold tracking-[0.1em] text-muted/70 uppercase"
              style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {display.map((activity, i) => (
            <tr
              key={activity.id}
              className={`border-b border-border/30 ${rowStyle(activity)} animate-fade-in-up`}
              style={{ animationDelay: `${300 + i * 60}ms` }}
            >
              <td className="py-3.5 pr-4 text-xl font-semibold truncate">
                <span className="flex items-center gap-3">
                  {activity.activity_name}
                  {activity.is_today && (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-accent/20 border border-accent/40 px-2.5 py-0.5 text-xs font-bold text-accent tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      TODAY
                    </span>
                  )}
                </span>
              </td>
              <td className="py-3.5 pr-4 text-xl tabular-nums truncate">{activity.activity_date}</td>
              <td className="py-3.5 pr-4 text-xl tabular-nums truncate">{activity.activity_time}</td>
              <td className="py-3.5 pr-4 text-xl tabular-nums truncate">{activity.attendees}</td>
              <td className="py-3.5">
                <StatusBadge status={activity.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function rowStyle(activity: Activity): string {
  if (activity.is_today) return "bg-accent/5 border-l-2 border-l-accent";
  if (activity.status === "Completed") return "opacity-45";
  if (activity.status === "Cancelled") return "opacity-35 line-through";
  return "";
}

function StatusBadge({ status }: { status: Activity["status"] }) {
  const config: Record<Activity["status"], { bg: string; text: string; dot: string }> = {
    Upcoming: {
      bg: "bg-warning/10 border border-warning/30",
      text: "text-warning",
      dot: "bg-warning",
    },
    Completed: {
      bg: "bg-success/10 border border-success/30",
      text: "text-success",
      dot: "bg-success",
    },
    Cancelled: {
      bg: "bg-danger/10 border border-danger/30",
      text: "text-danger",
      dot: "bg-danger",
    },
  };

  const c = config[status];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold tracking-wider ${c.bg} ${c.text}`}
    >
      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      {status.toUpperCase()}
    </span>
  );
}
