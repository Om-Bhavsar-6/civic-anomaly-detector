<<<<<<< HEAD
=======

>>>>>>> f81069a0acac47bd7d74ae405306fadba168e8a8
import { ReportList } from '@/components/report-list';
import type { Report } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Zap, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
<<<<<<< HEAD
import Image from 'next/image'

const placeholderReports: Report[] = [
    {
        id: '1',
        title: 'Pothole on MG Road',
        description: 'A large pothole near the metro station is causing traffic issues.',
        imageUrl: '/pothole.png',
        imageHint: 'pothole road',
        type: 'Pothole',
        status: 'Resolved',
        reportedAt: '2 days ago'
    },
    {
        id: '2',
        title: 'Graffiti at Vishal Mega Mart',
        description: 'Graffiti was spray-painted on the front wall of the Vishal Mega Mart in Connaught Place.',
        imageUrl: '/graffiti.png',
        imageHint: 'graffiti wall',
        type: 'Graffiti',
        status: 'In Progress',
        reportedAt: '5 hours ago'
    },
    {
        id: '3',
        title: 'Broken Streetlight in Koramangala',
        description: 'The streetlight on 5th Block main road is not working.',
        imageUrl: '/streetlight.png',
        imageHint: 'streetlight dark',
        type: 'Broken Streetlight',
        status: 'Received',
        reportedAt: '1 day ago'
    },
=======

const placeholderReports: Report[] = [
    { id: '1', title: 'Pothole on MG Road', description: 'A large pothole near the metro station is causing traffic issues.', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'pothole road', type: 'Pothole', status: 'Resolved', reportedAt: '2 days ago' },
    { id: '2', title: 'Graffiti at Vishal Mega Mart', description: 'Graffiti was spray-painted on the front wall of the Vishal Mega Mart in Connaught Place.', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'graffiti wall', type: 'Graffiti', status: 'In Progress', reportedAt: '5 hours ago' },
    { id: '3', title: 'Broken Streetlight in Koramangala', description: 'The streetlight on 5th Block main road is not working.', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'streetlight dark', type: 'Broken Streetlight', status: 'Received', reportedAt: '1 day ago' },
>>>>>>> f81069a0acac47bd7d74ae405306fadba168e8a8
];

const achievements = [
    { icon: Trophy, value: '1,200+', label: 'Anomalies Resolved' },
    { icon: Zap, value: '24 hours', label: 'Average Response Time' },
    { icon: Users, value: '5,000+', label: 'Community Reporters' },
];

export default function Home() {
<<<<<<< HEAD
    const reports = placeholderReports;

    return (
        <main className="flex min-h-screen flex-col items-center p-8 md:p-24">
            <div className="space-y-12 w-full">
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

                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Community Reports</h2>
                    <p className="text-muted-foreground mb-6">
                        Browse recent anomalies reported by the community.
                    </p>
                    <ReportList reports={reports} />
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
        </main>
    );
=======
  const reports = placeholderReports;

  return (
    <div className="space-y-12">
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

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Community Reports</h2>
        <p className="text-muted-foreground mb-6">
          Browse recent anomalies reported by the community.
        </p>
        <ReportList reports={reports} />
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
>>>>>>> f81069a0acac47bd7d74ae405306fadba168e8a8
}
