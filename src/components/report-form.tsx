
"use client";

import { useState, useRef, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Camera, Loader2, LightbulbOff, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { PotholeIcon, GraffitiIcon } from '@/components/icons';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { submitReport } from '@/app/report/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { AnomalyType } from '@/lib/types';
import { detectAnomaly, type DetectAnomalyOutput } from '@/ai/flows/detect-anomaly-flow';

const anomalyTypes: { type: AnomalyType; icon: React.ElementType; label: string }[] = [
    { type: AnomalyType.Pothole, icon: PotholeIcon, label: 'Pothole' },
    { type: AnomalyType.BrokenStreetlight, icon: LightbulbOff, label: 'Streetlight' },
    { type: AnomalyType.Graffiti, icon: GraffitiIcon, label: 'Graffiti' },
    { type: AnomalyType.Other, icon: AlertTriangle, label: 'Other' },
];

const reportSchema = z.object({
  image: z.string().min(1, 'An image is required.'),
  anomalyType: z.nativeEnum(AnomalyType, { errorMap: () => ({ message: 'Please select an anomaly type.'})}),
  title: z.string().min(1, 'A title is required.'),
  description: z.string().min(1, 'A description is required.'),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export function ReportForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isAnalyzing, startAnalyzing] = useTransition();
  const [analysisResult, setAnalysisResult] = useState<DetectAnomalyOutput | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      image: '',
      anomalyType: undefined,
      title: '',
      description: '',
    },
  });
  
  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };

    getCameraPermission();
  }, []);
  
  const handleImageSelect = (dataUri: string) => {
    setImagePreview(dataUri);
    form.setValue('image', dataUri, { shouldValidate: true });
    setAnalysisResult(null);

    startAnalyzing(async () => {
      try {
        const result = await detectAnomaly({ photoDataUri: dataUri });
        setAnalysisResult(result);
        form.setValue('title', result.title);
        form.setValue('description', result.description);
      } catch (error) {
        console.error('Analysis failed:', error);
        toast({ variant: 'destructive', title: "Analysis Failed", description: "Could not analyze the image." });
      }
    });
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        handleImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCapture = () => {
    if (videoRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const dataUri = canvas.toDataURL('image/jpeg');
            handleImageSelect(dataUri);
        }
    }
  };

  const onSubmit: SubmitHandler<ReportFormValues> = async (data) => {
    if (!analysisResult?.isAnomaly) {
      toast({ variant: 'destructive', title: "Cannot Report", description: "No anomaly was detected in the image." });
      return;
    }
    
    setIsSubmitting(true);

    try {
        const formData = new FormData();
        formData.append('anomalyType', data.anomalyType);
        formData.append('photoDataUri', data.image);
        formData.append('title', data.title);
        formData.append('description', data.description);
        
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
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({ variant: 'destructive', title: "Submission Failed", description: `Could not submit your report: ${errorMessage}` });
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
                Take a picture or upload a photo of the anomaly.
              </p>
               <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormControl>
                        <div className="space-y-4">
                            <div
                                className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors"
                                onClick={() => !imagePreview && fileInputRef.current?.click()}
                            >
                                {imagePreview ? (
                                    <Image src={imagePreview} alt="Anomaly preview" fill className="rounded-lg object-contain p-2" />
                                ) : (
                                  <>
                                    <video ref={videoRef} className="w-full h-full object-cover rounded-md" autoPlay muted playsInline/>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                                        <Camera className="w-10 h-10 mb-3" />
                                        <p className="mb-2 text-sm">Click to upload or use camera</p>
                                    </div>
                                  </>
                                )}
                                <Input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                />
                            </div>
                            { hasCameraPermission === false && (
                                <Alert variant="destructive">
                                          <AlertTitle>Camera Access Denied</AlertTitle>
                                          <AlertDescription>
                                            Please allow camera access to take a photo. You can still upload a file manually.
                                          </AlertDescription>
                                  </Alert>
                            )}
                            <div className="flex justify-center">
                                <Button type="button" onClick={handleCapture} disabled={!hasCameraPermission || isAnalyzing}>
                                    <Camera className="mr-2" />
                                    Capture Photo
                                </Button>
                            </div>
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            { (isAnalyzing || analysisResult) && (
              <div className="space-y-4 rounded-lg border bg-card p-4">
                 <div className="flex items-center gap-3">
                    {isAnalyzing && <Loader2 className="w-6 h-6 animate-spin text-primary" />}
                    {!isAnalyzing && analysisResult?.isAnomaly && <CheckCircle className="w-6 h-6 text-green-500" />}
                    {!isAnalyzing && !analysisResult?.isAnomaly && <XCircle className="w-6 h-6 text-destructive" />}
                    <h3 className="text-lg font-medium">AI Analysis</h3>
                </div>

                {isAnalyzing && (
                  <p className="text-sm text-muted-foreground">Analyzing image for anomalies...</p>
                )}
                
                {analysisResult && (
                  <div className='space-y-4'>
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly={!isAnalyzing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} readOnly={!isAnalyzing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            )}

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
            <Button type="submit" disabled={isSubmitting || isAnalyzing || !form.formState.isValid || !analysisResult?.isAnomaly} className="w-full">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              { isAnalyzing ? 'Analyzing...' : 'Submit Report'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
