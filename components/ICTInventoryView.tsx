import type { ITInventoryItem, CTInventoryItem } from "@/lib/types";

interface ICTInventoryViewProps {
  itInventory: ITInventoryItem[];
  ctInventory: CTInventoryItem[];
}

const headerStyle = { fontFamily: "var(--font-oswald), var(--font-display)" };

const itColumns: { key: keyof ITInventoryItem; label: string }[] = [
  { key: "desktop", label: "Desktop" },
  { key: "laptop", label: "Laptop" },
  { key: "servers", label: "Servers" },
  { key: "cctvs", label: "CCTVs" },
  { key: "body_worn_cameras_live", label: "BWC (Live)" },
  { key: "body_worn_cameras_recording", label: "BWC (Rec)" },
  { key: "drones", label: "Drones" },
];

const esColumns: { key: keyof ITInventoryItem; label: string }[] = [
  { key: "cybereason", label: "Cybereason" },
  { key: "sophos", label: "Sophos" },
];

const ctColumns: { key: keyof CTInventoryItem; label: string }[] = [
  { key: "tactical", label: "Tactical" },
  { key: "hytera_handheld", label: "Hytera HH" },
  { key: "hytera_base_radio", label: "Hytera Base" },
  { key: "hytera_mobile_radio", label: "Hytera Mobile" },
  { key: "poc_oneprime", label: "PoC OnePrime" },
  { key: "poc_yategood", label: "PoC Yategood" },
  { key: "smartphones", label: "Smartphones" },
];

export default function ICTInventoryView({ itInventory, ctInventory }: ICTInventoryViewProps) {
  const officeSet = new Set<string>();
  itInventory.forEach((item) => officeSet.add(item.office));
  ctInventory.forEach((item) => officeSet.add(item.office));
  const offices = Array.from(officeSet);

  const itByOffice = new Map(itInventory.map((item) => [item.office, item]));
  const ctByOffice = new Map(ctInventory.map((item) => [item.office, item]));

  const itTotals = itColumns.map((col) =>
    itInventory.reduce((sum, item) => sum + (Number(item[col.key]) || 0), 0)
  );
  const esTotals = esColumns.map((col) =>
    itInventory.reduce((sum, item) => sum + (Number(item[col.key]) || 0), 0)
  );
  const ctTotals = ctColumns.map((col) =>
    ctInventory.reduce((sum, item) => sum + (Number(item[col.key]) || 0), 0)
  );

  return (
    <div className="px-4 py-1 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <table className="w-full table-fixed border-collapse">
        <thead>
          {/* Group header row */}
          <tr>
            <th
              rowSpan={2}
              className="py-1 pr-2 text-[10px] font-bold tracking-[0.1em] text-muted/70 uppercase text-left align-bottom border-b border-border/60"
              style={headerStyle}
            >
              Office
            </th>
            <th
              colSpan={itColumns.length}
              className="py-1 text-xs font-bold tracking-[0.1em] uppercase text-center border-b border-border/60 bg-blue-500/15 text-blue-300"
              style={headerStyle}
            >
              IT Equipment
            </th>
            <th
              colSpan={esColumns.length}
              className="py-1 text-xs font-bold tracking-[0.1em] uppercase text-center border-b border-border/60 bg-purple-500/15 text-purple-300"
              style={headerStyle}
            >
              Endpoint Security
            </th>
            <th
              colSpan={ctColumns.length}
              className="py-1 text-xs font-bold tracking-[0.1em] uppercase text-center border-b border-border/60 bg-emerald-500/15 text-emerald-300"
              style={headerStyle}
            >
              CT Equipment
            </th>
          </tr>
          {/* Sub-header row */}
          <tr className="border-b border-border/60">
            {itColumns.map((col) => (
              <th
                key={col.key}
                className="py-1 px-0.5 text-[10px] font-bold tracking-[0.02em] uppercase text-center bg-blue-500/8 text-blue-300/70"
                style={headerStyle}
              >
                {col.label}
              </th>
            ))}
            {esColumns.map((col) => (
              <th
                key={col.key}
                className="py-1 px-0.5 text-[10px] font-bold tracking-[0.02em] uppercase text-center bg-purple-500/8 text-purple-300/70"
                style={headerStyle}
              >
                {col.label}
              </th>
            ))}
            {ctColumns.map((col) => (
              <th
                key={col.key}
                className="py-1 px-0.5 text-[10px] font-bold tracking-[0.02em] uppercase text-center bg-emerald-500/8 text-emerald-300/70"
                style={headerStyle}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {offices.map((office, i) => {
            const it = itByOffice.get(office);
            const ct = ctByOffice.get(office);
            return (
              <tr
                key={office}
                className="border-b border-border/30 animate-fade-in-up"
                style={{ animationDelay: `${300 + i * 60}ms` }}
              >
                <td className="py-1.5 pr-2 text-sm font-semibold">{office}</td>
                {itColumns.map((col) => (
                  <td key={col.key} className="py-1.5 px-0.5 text-sm tabular-nums text-center bg-blue-500/[0.03]">
                    {it ? Number(it[col.key]) || 0 : 0}
                  </td>
                ))}
                {esColumns.map((col) => (
                  <td key={col.key} className="py-1.5 px-0.5 text-sm tabular-nums text-center bg-purple-500/[0.03]">
                    {it ? Number(it[col.key]) || 0 : 0}
                  </td>
                ))}
                {ctColumns.map((col) => (
                  <td key={col.key} className="py-1.5 px-0.5 text-sm tabular-nums text-center bg-emerald-500/[0.03]">
                    {ct ? Number(ct[col.key]) || 0 : 0}
                  </td>
                ))}
              </tr>
            );
          })}
          {/* Totals row */}
          <tr className="border-t-2 border-border/60">
            <td
              className="py-2 pr-2 text-base font-bold uppercase tracking-[0.1em]"
              style={headerStyle}
            >
              Total
            </td>
            {itTotals.map((total, i) => (
              <td key={itColumns[i].label} className="py-2 px-0.5 text-base font-bold tabular-nums text-center bg-blue-500/10 text-blue-200">
                {total}
              </td>
            ))}
            {esTotals.map((total, i) => (
              <td key={esColumns[i].label} className="py-2 px-0.5 text-base font-bold tabular-nums text-center bg-purple-500/10 text-purple-200">
                {total}
              </td>
            ))}
            {ctTotals.map((total, i) => (
              <td key={ctColumns[i].label} className="py-2 px-0.5 text-base font-bold tabular-nums text-center bg-emerald-500/10 text-emerald-200">
                {total}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
