import { ReportForm } from '@/components/report-form';

export default function ReportPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Real-Time Anomaly Detection</h2>
        <p className="text-muted-foreground">
          Upload an image of a potential issue to see a live analysis.
        </p>
      </div>
      <ReportForm />
    </div>
  );
}
