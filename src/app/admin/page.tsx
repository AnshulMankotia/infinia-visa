import { format } from "date-fns";
import { KpiCards } from "@/components/admin/kpi-cards";
import { VolumeChart } from "@/components/admin/volume-chart";
import { StatusBreakdown } from "@/components/admin/status-breakdown";
import { NeedsAttention } from "@/components/admin/needs-attention";
import { ByDestination } from "@/components/admin/by-destination";
import { ActivityTable } from "@/components/admin/activity-table";
import { STAFF_ONLINE } from "@/data/admin";

export const metadata = { title: "Operations dashboard | Infinia Visa Admin" };

/**
 * Operations overview.
 *
 * Four readouts, then volume beside the status split, then the aging queue beside today's
 * corridors, then the audit trail. Every block is stagger-ordered by its `index`, reading
 * left to right and top to bottom.
 */
export default function AdminDashboardPage() {
  // Rendered on the server, so the date never flickers or mismatches on hydration.
  const today = format(new Date(), "EEEE, MMMM d");

  return (
    <main className="flex-1 px-5 py-6 md:px-7 md:pb-10">
      <header className="mb-6">
        <h1 className="font-heading text-[26px] leading-tight text-ink sm:text-[32px] md:text-[36px]">
          Operations dashboard
        </h1>
        <p className="mt-1.5 flex items-center gap-2 text-[13px] text-ink-soft">
          {today}
          <span aria-hidden="true" className="size-1 rounded-full bg-ink-soft/40" />
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-positive" />
            {STAFF_ONLINE} staff online
          </span>
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <KpiCards />

        <div className="grid gap-4 lg:grid-cols-5">
          <VolumeChart index={4} className="lg:col-span-3" />
          <StatusBreakdown index={5} className="lg:col-span-2" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <NeedsAttention index={6} />
          <ByDestination index={7} />
        </div>

        <ActivityTable index={8} />
      </div>
    </main>
  );
}
