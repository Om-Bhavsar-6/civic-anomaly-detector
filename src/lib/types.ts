export type AnomalyType = 'Pothole' | 'Broken Streetlight' | 'Graffiti' | 'Other';
export type ReportStatus = 'Received' | 'In Progress' | 'Resolved';

export interface Report {
  id: string;
  title: string;
  type: AnomalyType;
  description: string;
  imageUrl: string;
  imageHint: string;
  status: ReportStatus;
  reportedAt: string;
}
