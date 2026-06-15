import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LightbulbOff, AlertTriangle, Clock } from 'lucide-react';
import { PotholeIcon, GraffitiIcon } from '@/components/icons';
import type { Report, AnomalyType, ReportStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

const anomalyIcons: Record<AnomalyType, React.ElementType> = {
  'Pothole': PotholeIcon,
  'Broken Streetlight': LightbulbOff,
  'Graffiti': GraffitiIcon,
  'Other': AlertTriangle,
};

const statusColors: Record<ReportStatus, string> = {
  'Received': 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100',
  'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100',
  'Resolved': 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100',
};

interface ReportCardProps {
  report: Report;
}

export function ReportCard({ report }: ReportCardProps) {
  const Icon = anomalyIcons[report.type] || AlertTriangle;

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="pr-4 text-lg">{report.title}</CardTitle>
          <Badge
            className={cn("whitespace-nowrap border text-xs font-medium", statusColors[report.status])}
          >
            {report.status}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-2 pt-1 text-xs">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span>{report.type}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="relative aspect-video w-full">
          <Image
            src={report.imageUrl}
            alt={report.title}
            data-ai-hint={report.imageHint}
            fill
            className="rounded-md object-cover"
          />
        </div>
        <p className="text-sm text-muted-foreground">{report.description}</p>
      </CardContent>
      <CardFooter className="flex justify-end text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{report.reportedAt}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
