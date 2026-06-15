import { ReportCard } from '@/components/report-card';
import type { Report } from '@/lib/types';

interface ReportListProps {
  reports: Report[];
}

export function ReportList({ reports }: ReportListProps) {
  if (!reports.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-card p-12 text-center">
        <h3 className="text-lg font-semibold text-muted-foreground">No reports yet</h3>
        <p className="text-sm text-muted-foreground">Be the first to report an issue!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  );
}
