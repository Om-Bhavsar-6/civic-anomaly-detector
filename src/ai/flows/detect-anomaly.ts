'use server';

/**
 * @fileOverview Detects anomalies from an uploaded image using AI.
 *
 * - detectAnomalyFromImage - A function that accepts an image and returns a list of detected anomalies.
 * - DetectAnomalyFromImageInput - The input type for the detectAnomalyFromImage function.
 * - DetectAnomalyFromImageOutput - The return type for the detectAnomalyFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectAnomalyFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectAnomalyFromImageInput = z.infer<typeof DetectAnomalyFromImageInputSchema>;

const DetectAnomalyFromImageOutputSchema = z.object({
  anomalies: z.array(
    z.string().describe('A description of a detected anomaly.')
  ).describe('A list of detected anomalies in the image.')
});
export type DetectAnomalyFromImageOutput = z.infer<typeof DetectAnomalyFromImageOutputSchema>;

export async function detectAnomalyFromImage(input: DetectAnomalyFromImageInput): Promise<DetectAnomalyFromImageOutput> {
  return detectAnomalyFromImageFlow(input);
}

const detectAnomalyFromImagePrompt = ai.definePrompt({
  name: 'detectAnomalyFromImagePrompt',
  input: {schema: DetectAnomalyFromImageInputSchema},
  output: {schema: DetectAnomalyFromImageOutputSchema},
  prompt: `You are an AI that detects anomalies in images of city infrastructure.
  Analyze the image and identify any anomalies, such as potholes, broken streetlights, graffiti, or other issues that need to be reported to the city.
  Return a list of short descriptions of each detected anomaly.
  Image: {{media url=photoDataUri}}`
});

const detectAnomalyFromImageFlow = ai.defineFlow(
  {
    name: 'detectAnomalyFromImageFlow',
    inputSchema: DetectAnomalyFromImageInputSchema,
    outputSchema: DetectAnomalyFromImageOutputSchema,
  },
  async input => {
    const {output} = await detectAnomalyFromImagePrompt(input);
    return output!;
  }
);
