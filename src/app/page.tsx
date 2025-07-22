
import { ReportList } from '@/components/report-list';
import type { Report } from '@/lib/types';
<<<<<<< HEAD
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Zap, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const placeholderReports: Report[] = [
 HEAD
    { id: '1', title: 'Pothole on MG Road', description: 'A large pothole near the metro station is causing traffic issues.', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'pothole road', type: 'Pothole', status: 'Resolved', reportedAt: '2 days ago' },
    { id: '2', title: 'Graffiti at Vishal Mega Mart', description: 'Graffiti was spray-painted on the front wall of the Vishal Mega Mart in Connaught Place.', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'graffiti wall', type: 'Graffiti', status: 'In Progress', reportedAt: '5 hours ago' },
    { id: '3', title: 'Broken Streetlight in Koramangala', description: 'The streetlight on 5th Block main road is not working.', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'streetlight dark', type: 'Broken Streetlight', status: 'Received', reportedAt: '1 day ago' },

    { id: '1', title: 'Pothole on Elm Street', description: 'A large pothole is causing issues for drivers.', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'pothole road', type: 'Pothole', status: 'Resolved', reportedAt: '2 days ago' },
    { id: '2', title: 'Graffiti on Park Wall', description: 'Spray paint graffiti was found on the main park wall near the entrance.', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'graffiti wall', type: 'Graffiti', status: 'In Progress', reportedAt: '5 hours ago' },
    { id: '3', title: 'Broken Streetlight', description: 'The streetlight at the corner of 5th and Main is out.', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'streetlight dark', type: 'Broken Streetlight', status: 'Received', reportedAt: '1 day ago' },
 1b77dbb (Remove the firebase console from the project
  
 )
];

const achievements = [
    { icon: Trophy, value: '1,200+', label: 'Anomalies Resolved' },
    { icon: Zap, value: '24 hours', label: 'Average Response Time' },
    { icon: Users, value: '5,000+', label: 'Community Reporters' },
=======
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
>>>>>>> 002b2f7 (remove location tab and after uploading the image the web app must detec)
];

const achievements = [
    { icon: Trophy, value: '1,200+', label: 'Anomalies Resolved' },
    { icon: Zap, value: '24 hours', label: 'Average Response Time' },
    { icon: Users, value: '5,000+', label: 'Community Reporters' },
];

export default function Home() {
  const reports = placeholderReports;

  return (
    <div className="space-y-12">
<<<<<<< HEAD
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Improve Your City, One Report at a Time</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Our platform empowers you to report civic issues like potholes and graffiti in real-time. Join thousands of community members making a difference.
        </p>
        <Button asChild size="lg">
          <Link href="/report">
            <PlusCircle className="mr-2" />
            Report an Anomaly
          </Link>
        </Button>
      </div>

=======
>>>>>>> 002b2f7 (remove location tab and after uploading the image the web app must detec)
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Community Reports</h2>
        <p className="text-muted-foreground mb-6">
          Browse recent anomalies reported by the community.
        </p>
<<<<<<< HEAD
        <ReportList reports={reports} />
=======
        <ReportList reports={mockReports} />
>>>>>>> 002b2f7 (remove location tab and after uploading the image the web app must detec)
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