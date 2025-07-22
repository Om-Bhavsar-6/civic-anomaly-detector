import { ReportForm } from '@/components/report-form';

export default function ReportPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Report a New Anomaly</h2>
        <p className="text-muted-foreground">
          Help us improve our city by reporting issues you find.
        </p>
      </div>
      <ReportForm />
    </div>
  );
}
