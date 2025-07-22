import { ReportList } from '@/components/report-list';
import type { Report } from '@/lib/types';

// Mock data for demonstration
const mockReports: Report[] = [
  {
    id: '1',
    title: 'Large Pothole on Main St',
    type: 'Pothole',
    description: 'A large and dangerous pothole has formed in the eastbound lane of Main Street, right before the intersection with Oak Ave.',
    location: { lat: 34.0522, lng: -118.2437 },
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'pothole road',
    status: 'In Progress',
    reportedAt: '2 days ago',
  },
  {
    id: '2',
    title: 'Streetlight out at City Park',
    type: 'Broken Streetlight',
    description: 'The streetlight at the main entrance of City Park is not working, making the area very dark and unsafe at night.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'dark park',
    status: 'Received',
    reportedAt: '5 hours ago',
  },
  {
    id: '3',
    title: 'Graffiti on library wall',
    type: 'Graffiti',
    description: 'Someone has spray-painted graffiti on the west-facing wall of the public library. It covers a large area.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'graffiti wall',
    status: 'Resolved',
    reportedAt: '1 week ago',
  },
  {
    id: '4',
    title: 'Overgrown bushes blocking sidewalk',
    type: 'Other',
    description: 'The bushes from a private residence are completely blocking the sidewalk on Elm Street, forcing pedestrians to walk in the road.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'overgrown bushes',
    status: 'Received',
    reportedAt: '22 hours ago',
  }
];

export default function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Community Reports</h2>
        <p className="text-muted-foreground">
          Browse recent anomalies reported by the community.
        </p>
      </div>
      <ReportList reports={mockReports} />
    </div>
  );
}
