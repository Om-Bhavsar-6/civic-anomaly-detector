import { ReportList } from '@/components/report-list';
import type { Report } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Zap, Users } from 'lucide-react';

// Mock data for demonstration
const mockReports: Report[] = [
  {
    id: '1',
    title: 'Large Pothole on Main St',
    type: 'Pothole',
    description: 'A large and dangerous pothole has formed in the eastbound lane of Main Street, right before the intersection with Oak Ave.',
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

const achievements = [
    { icon: Trophy, value: '1,200+', label: 'Anomalies Resolved' },
    { icon: Zap, value: '24 hours', label: 'Average Response Time' },
    { icon: Users, value: '5,000+', label: 'Community Reporters' },
];

export default function Home() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Community Reports</h2>
        <p className="text-muted-foreground">
          Browse recent anomalies reported by the community.
        </p>
        <ReportList reports={mockReports} />
      </div>

      <div>
        <h2 className="text-3xl font-bold tracking-tight text-center mb-2">Our Achievements</h2>
        <p className="text-muted-foreground text-center mb-8">
            We are proud of the impact we've made together.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <Card key={index}>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <achievement.icon className="w-12 h-12 text-primary mb-4" />
                <p className="text-3xl font-bold">{achievement.value}</p>
                <p className="text-muted-foreground">{achievement.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}