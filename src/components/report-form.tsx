
"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Camera, Loader2, LightbulbOff, AlertTriangle } from 'lucide-react';
import { PotholeIcon, GraffitiIcon } from '@/components/icons';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { submitReport } from '@/app/report/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { AnomalyType } from '@/lib/types';

const anomalyTypes: { type: AnomalyType; icon: React.ElementType; label: string }[] = [
    { type: 'Pothole', icon: PotholeIcon, label: 'Pothole' },
    { type: 'Broken Streetlight', icon: LightbulbOff, label: 'Streetlight' },
    { type: 'Graffiti', icon: GraffitiIcon, label: 'Graffiti' },
    { type: 'Other', icon: AlertTriangle, label: 'Other' },
];

const reportSchema = z.object({
  image: z.any().refine(value => value, 'An image is required.'),
  anomalyType: z.string().refine(value => !!value, { message: 'Please select an anomaly type.' }),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export function ReportForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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


  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      anomalyType: '',
      image: null,
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
        form.setValue('image', dataUri, { shouldValidate: true });
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
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({ variant: 'destructive', title: "Submission Failed", description: `Could not submit your report: ${errorMessage}` });
    } finally {
        setIsSubmitting(false);
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
            setImagePreview(dataUri);
            
            // Set value for form validation
            form.setValue('image', dataUri, { shouldValidate: true });
        }
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
                Upload a photo, or use your camera.
              </p>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
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
                                        <p className="mb-2 text-sm">Click to upload a photo</p>
                                    </div>
                                  </>
                                )}
                                <Input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onBlur={field.onBlur}
                                    name={field.name}
                                    onChange={(e) => {
                                      handleImageChange(e);
                                    }}
                                />
                            </div>
                            { hasCameraPermission === false && (
                                <Alert variant="destructive">
                                          <AlertTitle>Camera Access Required</AlertTitle>
                                          <AlertDescription>
                                            Please allow camera access to use this feature. You can still upload a photo manually.
                                          </AlertDescription>
                                  </Alert>
                            )}
                            <div className="flex justify-center">
                                <Button type="button" onClick={handleCapture} disabled={!hasCameraPermission}>
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
            <Button type="submit" disabled={isSubmitting || !form.formState.isValid} className="w-full">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit Report
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
