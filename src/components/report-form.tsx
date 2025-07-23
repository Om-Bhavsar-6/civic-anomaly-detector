
"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Loader2, CheckCircle, XCircle, Upload, Phone, Mail, Link as LinkIcon, Twitter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { detectAnomaly, type DetectAnomalyOutput } from '@/ai/flows/detect-anomaly-flow';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

export function ReportForm() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<DetectAnomalyOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      reader.readAsDataURL(file);
    }
  };

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
          </DialogHeader>
          {isAnalyzing ? (
            <div className="flex items-center space-x-4 py-8">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <p>Analyzing...</p>
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
        </DialogContent>
      </Dialog>
    </>
  );
}
