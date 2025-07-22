import type { Timestamp } from 'firebase/firestore';

export enum AnomalyType {
  Pothole = 'Pothole',
  BrokenStreetlight = 'Broken Streetlight',
  Graffiti = 'Graffiti',
  Other = 'Other',
};

export type ReportStatus = 'Received' | 'In Progress' | 'Resolved';

export interface Report {
  id: string;
  title: string;
  type: AnomalyType;
  description: string;
  imageUrl: string;
  imageHint: string;
  status: ReportStatus;
  reportedAt: Timestamp | Date | string; // Allow for Firestore Timestamp, client-side Date, and string formatting
}
