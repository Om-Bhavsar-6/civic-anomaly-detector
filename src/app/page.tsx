
import { ReportList } from '@/components/report-list';
import type { Report } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Zap, Users } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';

async function getReports(): Promise<Report[]> {
  const reportsCol = collection(db, 'reports');
  const reportsQuery = query(reportsCol, orderBy('reportedAt', 'desc'), limit(10));
  const reportSnapshot = await getDocs(reportsQuery);
  
  const reports: Report[] = reportSnapshot.docs.map(doc => {
    const data = doc.data();
    const reportedAtDate = data.reportedAt.toDate();
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      imageHint: data.imageHint,
      type: data.type,
      status: data.status,
      reportedAt: formatDistanceToNow(reportedAtDate) + ' ago',
    } as Report;
  });

  return reports;
}

const achievements = [
    { icon: Trophy, value: '1,200+', label: 'Anomalies Resolved' },
    { icon: Zap, value: '24 hours', label: 'Average Response Time' },
    { icon: Users, value: '5,000+', label: 'Community Reporters' },
];

export default async function Home() {
  const reports = await getReports();

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Community Reports</h2>
        <p className="text-muted-foreground">
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
}

export const revalidate = 60; // Re-fetch data every 60 seconds
