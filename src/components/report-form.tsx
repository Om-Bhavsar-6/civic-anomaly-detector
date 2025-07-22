
"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Camera, Loader2, LightbulbOff, AlertTriangle, CheckCircle, XCircle, Upload } from 'lucide-react';
import { PotholeIcon, GraffitiIcon } from '@/components/icons';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { submitReport } from '@/app/report/actions';
import { AnomalyType } from '@/lib/types';
import { detectAnomaly, DetectAnomalyOutput } from '@/ai/flows/detect-anomaly-flow';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

const anomalyTypes: { type: AnomalyType; icon: React.ElementType; label: string }[] = [
    { type: AnomalyType.Pothole, icon: PotholeIcon, label: 'Pothole' },
    { type: AnomalyType.BrokenStreetlight, icon: LightbulbOff, label: 'Streetlight' },
    { type: AnomalyType.Graffiti, icon: GraffitiIcon, label: 'Graffiti' },
    { type: AnomalyType.Other, icon: AlertTriangle, label: 'Other' },
];

const reportSchema = z.object({
  image: z.string().min(1, 'An image is required.'),
  anomalyType: z.nativeEnum(AnomalyType, { errorMap: () => ({ message: 'Please select an anomaly type.'})}),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export function ReportForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DetectAnomalyOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: { image: '', anomalyType: undefined },
  });
  
  const handleImageSelect = (dataUri: string) => {
    setImagePreview(dataUri);
    form.setValue('image', dataUri, { shouldValidate: true });
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => handleImageSelect(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

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
    <>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAnalysisAndSubmit)}>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">1. Anomaly Photo</h3>
                <p className="text-sm text-muted-foreground">Upload a photo of the anomaly.</p>
                <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem>
                      <FormControl>
                          <div className="space-y-4">
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
                                  <Input type="file" accept="image/png, image/jpeg, image/jpg" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
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
          </DialogHeader>
          {isAnalyzing ? (
            <div className="flex items-center space-x-4">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <p>Analyzing image...</p>
            </div>
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
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
