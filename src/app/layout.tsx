import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/header";
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Civic Anomaly Detector',
  description: 'Report urban anomalies and help improve your city.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased min-h-screen bg-background text-foreground flex flex-col")}>
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
