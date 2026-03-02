import type { Compliance } from "@/lib/types";
import { getRealtimeComplianceStatus, type ComplianceStatus } from "@/lib/status";
import { formatDate } from "@/lib/format";

interface CompliancesTableProps {
  compliances: Compliance[];
}

const STATUS_CONFIG: Record<ComplianceStatus, { bg: string; text: string; dot: string; label: string }> = {
  overdue: {
    bg: "bg-danger/10 border border-danger/30",
    text: "text-danger",
    dot: "bg-danger",
    label: "OVERDUE",
  },
  not_complied: {
    bg: "bg-danger/10 border border-danger/30",
    text: "text-danger",
    dot: "bg-danger",
    label: "NOT COMPLIED",
  },
  due_soon: {
    bg: "bg-warning/10 border border-warning/30",
    text: "text-warning",
    dot: "bg-warning",
    label: "DUE SOON",
  },
  disseminated: {
    bg: "bg-accent/10 border border-accent/30",
    text: "text-accent",
    dot: "bg-accent",
    label: "DISSEMINATED",
  },
  complied: {
    bg: "bg-success/10 border border-success/30",
    text: "text-success",
    dot: "bg-success",
    label: "COMPLIED",
  },
};

export default function CompliancesTable({ compliances }: CompliancesTableProps) {
  const display = compliances.slice(0, 8);

  return (
    <div className="px-10 py-2 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="border-b border-border/60 text-left">
            <th
              className="w-[30%] py-3 pr-4 text-base font-bold tracking-[0.1em] text-muted/70 uppercase"
              style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
            >
              Subject
            </th>
            <th
              className="w-[14%] py-3 pr-4 text-base font-bold tracking-[0.1em] text-muted/70 uppercase"
              style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
            >
              Category
            </th>
            <th
              className="w-[24%] py-3 pr-4 text-base font-bold tracking-[0.1em] text-muted/70 uppercase"
              style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
            >
              Action Required
            </th>
            <th
              className="w-[14%] py-3 pr-4 text-base font-bold tracking-[0.1em] text-muted/70 uppercase"
              style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
            >
              Target Date
            </th>
            <th
              className="w-[18%] py-3 text-base font-bold tracking-[0.1em] text-muted/70 uppercase"
              style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {display.map((compliance, i) => {
            const status = getRealtimeComplianceStatus(compliance);
            return (
              <tr
                key={compliance.id}
                className={`border-b border-border/30 ${status === "complied" ? "opacity-45" : ""} ${status === "overdue" ? "bg-danger/5 border-l-2 border-l-danger" : status === "due_soon" ? "bg-warning/5 border-l-2 border-l-warning" : ""} animate-fade-in-up`}
                style={{ animationDelay: `${300 + i * 60}ms` }}
              >
                <td className="py-3.5 pr-4 text-xl font-semibold">
                  {compliance.subject}
                </td>
                <td className="py-3.5 pr-4">
                  <ComplianceCategoryBadge category={compliance.category} />
                </td>
                <td className="py-3.5 pr-4 text-lg">{compliance.action_required}</td>
                <td className="py-3.5 pr-4 text-xl tabular-nums">{formatDate(compliance.target_date)}</td>
                <td className="py-3.5">
                  <ComplianceStatusBadge status={status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ComplianceStatusBadge({ status }: { status: ComplianceStatus }) {
  const c = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold tracking-wider ${c.bg} ${c.text}`}
    >
      <span className={`w-2 h-2 rounded-full ${c.dot} ${status === "overdue" || status === "not_complied" ? "animate-pulse" : ""}`} />
      {c.label}
    </span>
  );
}

function ComplianceCategoryBadge({ category }: { category: string }) {
  const upper = category.toUpperCase().trim();
  const style =
    upper === "RUSH"
      ? "bg-danger/10 border border-danger/30 text-danger"
      : upper === "PRIORITY"
        ? "bg-accent/10 border border-accent/30 text-accent"
        : "bg-muted/10 border border-muted/30 text-muted";

  return (
    <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold tracking-wider ${style}`}>
      {category}
    </span>
  );
}
