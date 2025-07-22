
"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Camera, Loader2, Wand2, CheckCircle, Info, LightbulbOff, AlertTriangle } from 'lucide-react';
import { PotholeIcon, GraffitiIcon } from '@/components/icons';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { runAnalysis, submitReport } from '@/app/report/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import type { AnomalyType } from '@/lib/types';

const anomalyTypes: { type: AnomalyType; icon: React.ElementType; label: string }[] = [
    { type: 'Pothole', icon: PotholeIcon, label: 'Pothole' },
    { type: 'Broken Streetlight', icon: LightbulbOff, label: 'Streetlight' },
    { type: 'Graffiti', icon: GraffitiIcon, label: 'Graffiti' },
    { type: 'Other', icon: AlertTriangle, label: 'Other' },
];

const reportSchema = z.object({
  image: z.instanceof(FileList).refine(files => files?.length > 0, 'An image is required.'),
  anomalyType: z.string().refine(value => !!value, { message: 'Please select an anomaly type.' }),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export function ReportForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      anomalyType: '',
    },
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        setAnalysisResult(null);
        setIsAnalyzing(true);
        try {
          const result = await runAnalysis(dataUri);
          setAnalysisResult(result.anomalies);
        } catch (error) {
          toast({ variant: 'destructive', title: "AI Analysis Failed", description: "Could not analyze the image." });
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit: SubmitHandler<ReportFormValues> = async (data) => {
    if (!imagePreview) {
        toast({ variant: 'destructive', title: "Image Required", description: "Please upload an image before submitting." });
        return;
    }
    setIsSubmitting(true);

    try {
        const formData = new FormData();
        formData.append('anomalyType', data.anomalyType);
        formData.append('photoDataUri', imagePreview);
        
        await submitReport(formData);

        toast({
            title: "Report Submitted!",
            description: "Thank you for helping improve your community. You will be redirected shortly.",
        });
        
        setTimeout(() => {
            router.push('/');
        }, 2000);

    } catch (error) {
        console.error("Submission failed", error);
        toast({ variant: 'destructive', title: "Submission Failed", description: "Could not submit your report. Please try again." });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">1. Anomaly Photo</h3>
              <p className="text-sm text-muted-foreground">
                Upload a photo. Our AI will analyze the issue.
              </p>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                        <div
                            className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {imagePreview ? (
                                <Image src={imagePreview} alt="Anomaly preview" fill className="rounded-lg object-contain p-2" />
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                                    <Camera className="w-10 h-10 mb-3" />
                                    <p className="mb-2 text-sm">Click to upload a photo</p>
                                    <p className="text-xs">PNG, JPG or GIF</p>
                                </div>
                            )}
                            <Input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onBlur={field.onBlur}
                                name={field.name}
                                onChange={(e) => {
                                  field.onChange(e.target.files);
                                  handleImageChange(e);
                                }}
                            />
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               {isAnalyzing && (
                  <Alert>
                    <Wand2 className="h-4 w-4 animate-pulse" />
                    <AlertTitle>AI Analysis in Progress</AlertTitle>
                    <AlertDescription>
                      Please wait while we analyze your photo...
                    </AlertDescription>
                  </Alert>
               )}
               {analysisResult && (
                  <Alert variant="default" className={cn(analysisResult.length > 0 ? "bg-blue-50 border-blue-200" : "bg-green-50 border-green-200")}>
                     {analysisResult.length > 0 ? <Info className="h-4 w-4 text-blue-600" /> : <CheckCircle className="h-4 w-4 text-green-600" />}
                    <AlertTitle className={cn(analysisResult.length > 0 ? "text-blue-800" : "text-green-800")}>
                      {analysisResult.length > 0 ? "Potential Anomalies Detected" : "Looking Good!"}
                    </AlertTitle>
                    <AlertDescription className={cn(analysisResult.length > 0 ? "text-blue-700" : "text-green-700")}>
                        {analysisResult.length > 0 ? `We detected: ${analysisResult.join(', ')}.` : "We couldn't auto-detect an issue, the image looks normal."} Please select an anomaly type below.
                    </AlertDescription>
                  </Alert>
               )}
            </div>

            <div className="space-y-2">
                <h3 className="text-lg font-medium">2. Anomaly Type</h3>
                <p className="text-sm text-muted-foreground">
                    Select the type of issue you are reporting.
                </p>
                <FormField
                control={form.control}
                name="anomalyType"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <div className="grid grid-cols-2 gap-4">
                            {anomalyTypes.map(({type, icon: Icon, label}) => (
                                <Button
                                key={type}
                                type="button"
                                variant={field.value === type ? 'default' : 'outline'}
                                className="h-20 text-base"
                                onClick={() => field.onChange(type)}
                                >
                                <Icon className="mr-2 h-6 w-6" />
                                {label}
                                </Button>
                            ))}
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting || isAnalyzing || !imagePreview} className="w-full">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit Report
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
