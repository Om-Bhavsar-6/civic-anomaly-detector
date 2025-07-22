
"use client";

 HEAD
import { useState, useRef } from 'react';
import Image from 'next/image';
 HEAD
 HEAD
import { Loader2, CheckCircle, XCircle, Upload, Phone, Mail, Link as LinkIcon, Twitter } from 'lucide-react';
import Link from 'next/link';
import { Loader2, CheckCircle, XCircle, Upload } from 'lucide-react';
1b77dbb (Remove the firebase console from the project and make the project work t)

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { detectAnomaly, DetectAnomalyOutput } from '@/ai/flows/detect-anomaly-flow';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
 HEAD
import { Separator } from '@/components/ui/separator';
 1b77dbb (Remove the firebase console from the project and make the project work t)

import { Camera, Loader2, LightbulbOff, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
 HEAD
import { Camera, Loader2, LightbulbOff, AlertTriangle } from 'lucide-react';
 eeb2f48 (remove the AI analysis component)

import { Camera, Loader2, LightbulbOff, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
 47aefef (I see this error with the app, reported by NextJS, please fix it. The er)
import { PotholeIcon, GraffitiIcon } from '@/components/icons';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { submitReport } from '@/app/report/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
 HEAD
import { AnomalyType } from '@/lib/types';
 HEAD
import { detectAnomaly, DetectAnomalyOutput } from '@/ai/flows/detect-anomaly-flow';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
 eeb2f48 (remove the AI analysis component)

import { Textarea } from '@/components/ui/textarea';
import { AnomalyType } from '@/lib/types';
import { detectAnomaly, type DetectAnomalyOutput } from '@/ai/flows/detect-anomaly-flow';
 47aefef (I see this error with the app, reported by NextJS, please fix it. The er)

const anomalyTypes: { type: AnomalyType; icon: React.ElementType; label: string }[] = [
    { type: AnomalyType.Pothole, icon: PotholeIcon, label: 'Pothole' },
    { type: AnomalyType.BrokenStreetlight, icon: LightbulbOff, label: 'Streetlight' },
    { type: AnomalyType.Graffiti, icon: GraffitiIcon, label: 'Graffiti' },
    { type: AnomalyType.Other, icon: AlertTriangle, label: 'Other' },
];

const reportSchema = z.object({
<<<<<<< HEAD
  image: z.string().min(1, 'An image is required.'),
  anomalyType: z.nativeEnum(AnomalyType, { errorMap: () => ({ message: 'Please select an anomaly type.'})}),
=======
  image: z.any().refine(value => value, 'An image is required.'),
  anomalyType: z.string().refine(value => !!value, { message: 'Please select an anomaly type.' }),
>>>>>>> 62d7698 (I see this error with the app, reported by NextJS, please fix it. The er)
});

type ReportFormValues = z.infer<typeof reportSchema>;
 17bf9d7 (also remove the details section. And when you click on submit report a P)

export function ReportForm() {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
 HEAD

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
 HEAD
 17bf9d7 (also remove the details section. And when you click on submit report a P)
  const [analysisResult, setAnalysisResult] = useState<DetectAnomalyOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

 eeb2f48 (remove the AI analysis component)

  const fileInputRef = useRef<HTMLInputElement>(null);
 HEAD
  
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        setIsAnalyzing(true);
        setIsDialogOpen(true);
        setAnalysisResult(null);
        try {
          const result = await detectAnomaly({ photoDataUri: dataUri });
          setAnalysisResult(result);
        } catch (error) {
          console.error("Analysis failed", error);
          toast({ variant: 'destructive', title: "Analysis Failed", description: "Could not analyze the image." });
          setIsDialogOpen(false);
        } finally {
          setIsAnalyzing(false);
        }
      };


  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: { image: '', anomalyType: undefined },
  });
  
  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        setHasCameraPermission(true);
        if (videoRef.current) videoRef.current.srcObject = stream;
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
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => handleImageSelect(reader.result as string);
 17bf9d7 (also remove the details section. And when you click on submit report a P)
      reader.readAsDataURL(file);
    }
  };
  
 HEAD
  return (
    <>
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-medium">Analyze an Image for Anomalies</h3>
            <p className="text-sm text-muted-foreground">
              Upload a photo to get a real-time analysis.
            </p>
            <div>
              <div
                className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <Image src={imagePreview} alt="Anomaly preview" fill className="rounded-lg object-contain p-2" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Upload className="w-10 h-10 mb-3" />
                    <p className="mb-2 text-sm">Click to upload an image</p>
                    <p className="text-xs">PNG, JPG, or JPEG</p>
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  // Reset file input to allow re-uploading the same file
                  onClick={(e) => { (e.target as HTMLInputElement).value = '' }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Analyzing Image</DialogTitle>
            <DialogDescription>Please wait while we process the image.</DialogDescription>

<<<<<<< HEAD
=======
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
  
>>>>>>> 62d7698 (I see this error with the app, reported by NextJS, please fix it. The er)
  const handleCapture = () => {
    if (videoRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            handleImageSelect(canvas.toDataURL('image/jpeg'));
        }
    }
  };

 HEAD
  const handleAnalysisAndSubmit: SubmitHandler<ReportFormValues> = async (data) => {
    setIsAnalyzing(true);
    setIsDialogOpen(true);
    try {
      const result = await detectAnomaly({ photoDataUri: data.image });
      setAnalysisResult(result);
    } catch (error) {
      console.error("Analysis failed", error);
      toast({ variant: 'destructive', title: "Analysis Failed", description: "Could not analyze the image." });
      setIsDialogOpen(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!analysisResult || !imagePreview || !form.getValues('anomalyType')) return;

  const onSubmit: SubmitHandler<ReportFormValues> = async (data) => {
 eeb2f48 (remove the AI analysis component)
    setIsSubmitting(true);

    try {
        const formData = new FormData();
        formData.append('anomalyType', form.getValues('anomalyType'));
        formData.append('photoDataUri', imagePreview);
        formData.append('title', analysisResult.title);
        formData.append('description', analysisResult.description);
        formData.append('confidence', analysisResult.confidence.toString());
        
        await submitReport(formData);

        toast({
            title: "Report Submitted!",
            description: "Thank you for helping improve your community. You will be redirected shortly.",
        });
        
        setTimeout(() => router.push('/'), 2000);

    } catch (error) {
        console.error("Submission failed", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({ variant: 'destructive', title: "Submission Failed", description: `Could not submit your report: ${errorMessage}` });
    } finally {
        setIsSubmitting(false);
        setIsDialogOpen(false);
    }
  };
  
  return (
 HEAD
    <>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAnalysisAndSubmit)}>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">1. Anomaly Photo</h3>
                <p className="text-sm text-muted-foreground">Take a picture or upload a photo.</p>

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
 eeb2f48 (remove the AI analysis component)
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
                                  <Input type="file" accept="image/*" capture="environment" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
                              </div>
                              {hasCameraPermission === false && (
                                  <Alert variant="destructive">
                                      <AlertTitle>Camera Access Denied</AlertTitle>
                                      <AlertDescription>Please allow camera access to take a photo. You can still upload a file manually.</AlertDescription>
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
                  <p className="text-sm text-muted-foreground">Select the type of issue you are reporting.</p>
                  <FormField
                    control={form.control}
                    name="anomalyType"
                    render={({ field }) => (
                      <FormItem>
                      <FormControl>
                          <div className="grid grid-cols-2 gap-4">
                              {anomalyTypes.map(({type, icon: Icon, label}) => (
                                  <Button key={type} type="button" variant={field.value === type ? 'default' : 'outline'} className="h-20 text-base" onClick={() => field.onChange(type)}>
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
              <Button type="submit" disabled={!form.formState.isValid} className="w-full">
                Submit Report
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Analyzing Anomaly</DialogTitle>
            <DialogDescription>Please wait while we analyze the image.</DialogDescription>
 17bf9d7 (also remove the details section. And when you click on submit report a P)
          </DialogHeader>
          {isAnalyzing ? (
            <div className="flex items-center space-x-4">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
 HEAD
                <p>Analyzing...</p>

 17bf9d7 (also remove the details section. And when you click on submit report a P)
            </div>
 HEAD
          ) : analysisResult ? (
            <div className="space-y-4">
                {analysisResult.isAnomaly ? (
                    <div className="flex items-center text-green-600">
                        <CheckCircle className="mr-2" />
                        <p className="font-semibold">Anomaly Detected!</p>
                    </div>
                ) : (
                    <div className="flex items-center text-yellow-600">
                        <XCircle className="mr-2" />
                        <p className="font-semibold">No Anomaly Detected</p>
                    </div>
                )}
                <div>
                    <h4 className="font-medium">Title</h4>
                    <p className="text-muted-foreground">{analysisResult.title}</p>
                </div>
                <div>
                    <h4 className="font-medium">Description</h4>
                    <p className="text-muted-foreground">{analysisResult.description}</p>
                </div>
 HEAD
                 {analysisResult.isAnomaly && (
                   <>
                    <div>
                        <h4 className="font-medium">Confidence</h4>
                        <div className="flex items-center gap-2">
                            <Progress value={analysisResult.confidence} className="w-[80%]" />
                            <span className="font-semibold">{analysisResult.confidence}%</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium">Suggested Solution</h4>
                        <p className="text-muted-foreground">{analysisResult.solution}</p>
                    </div>
                    <div>
                        <h4 className="font-medium">Fix Tip</h4>
                        <p className="text-muted-foreground">{analysisResult.fixTip}</p>
                    </div>
                    <Separator />
                    <div>
                        <h4 className="font-medium mb-2">Further Assistance</h4>
                        <p className="text-sm text-muted-foreground mb-2">For unresolved issues, you can contact the Ministry of Road Transport and Highways (MoRTH):</p>
                        <div className="space-y-2 text-sm">
                            <p className="flex items-center gap-2"><Phone className="h-4 w-4"/> Phone: 011-23351280 (Fax also)</p>
                            <p className="flex items-center gap-2"><Mail className="h-4 w-4"/> Email: wim.rth@nic.in</p>
                            <p className="flex items-center gap-2"><LinkIcon className="h-4 w-4"/> Website: <a href="https://morth.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://morth.gov.in</a></p>
                            <div className="flex items-center gap-4 pt-1">
                                <a href="https://x.com/MORTHIndia" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline"><Twitter className="h-4 w-4"/> Twitter</a>
                                <a href="https://morth.gov.in/contact-us" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Contact Us</a>
                                <a href="https://morth.gov.in/about-us" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">About Us</a>
                                <a href="https://morth.nic.in/who-is-who" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Who is Who</a>
                            </div>
                        </div>
                    </div>
                   </>
                 )}
            </div>
          ) : null}

                <div>
                    <h4 className="font-medium">Confidence</h4>
                    <div className="flex items-center gap-2">
                        <Progress value={analysisResult.confidence} className="w-[80%]" />
                        <span className="font-semibold">{analysisResult.confidence}%</span>
                    </div>
                </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleFinalSubmit} disabled={isAnalyzing || isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Confirm & Submit

            
            <div className="space-y-4 rounded-lg border bg-card p-4">
                 <div className="flex items-center gap-3">
                    <h3 className="text-lg font-medium">3. Details</h3>
                </div>
                <div className='space-y-4'>
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Large pothole on Main St" />
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
                            <Textarea {...field} placeholder="Describe the issue in more detail." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
              </div>

          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting || !form.formState.isValid} className="w-full">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit Report
 eeb2f48 (remove the AI analysis component)
            </Button>
          </DialogFooter>
 17bf9d7 (also remove the details section. And when you click on submit report a P)
        </DialogContent>
      </Dialog>
    </>
  );
}
