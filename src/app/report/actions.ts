"use server";

import { detectAnomalyFromImage, type DetectAnomalyFromImageOutput } from "@/ai/flows/detect-anomaly";

export async function runAnalysis(photoDataUri: string): Promise<DetectAnomalyFromImageOutput> {
  if (!photoDataUri || !photoDataUri.startsWith("data:image")) {
    throw new Error("Invalid image data provided.");
  }
  try {
    const result = await detectAnomalyFromImage({ photoDataUri });
    return result;
  } catch (error) {
    console.error("Error during AI analysis:", error);
    throw new Error("Failed to analyze image.");
  }
}
