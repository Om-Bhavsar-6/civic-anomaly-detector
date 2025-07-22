'use server';
/**
 * @fileOverview Anomaly detection AI agent.
 *
 * - detectAnomaly - A function that handles the anomaly detection process.
 * - DetectAnomalyInput - The input type for the detectAnomaly function.
 * - DetectAnomalyOutput - The return type for the detectAnomaly function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectAnomalyInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a potential urban anomaly, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectAnomalyInput = z.infer<typeof DetectAnomalyInputSchema>;

const DetectAnomalyOutputSchema = z.object({
    isAnomaly: z.boolean().describe('Whether or not the image contains a clear urban anomaly (like a pothole, graffiti, or broken streetlight).'),
    title: z.string().describe('A concise, descriptive title for the anomaly report (e.g., "Pothole on Main Street", "Graffiti on Park Bench"). If no anomaly is detected, this should be "No Anomaly Detected".'),
    description: z.string().describe("A brief, one-sentence description of the issue. If no anomaly is detected, this should state that the image appears normal."),
});
export type DetectAnomalyOutput = z.infer<typeof DetectAnomalyOutputSchema>;

export async function detectAnomaly(input: DetectAnomalyInput): Promise<DetectAnomalyOutput> {
  return detectAnomalyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectAnomalyPrompt',
  input: {schema: DetectAnomalyInputSchema},
  output: {schema: DetectAnomalyOutputSchema},
  prompt: `You are an AI assistant for a civic engagement app. Your task is to analyze an image to detect urban anomalies.

Analyze the image provided and determine if it shows a clear civic issue like a pothole, broken streetlight, graffiti, or other public infrastructure problems.

- If an anomaly is found, set isAnomaly to true and generate a suitable title and a one-sentence description for the report.
- If the image appears to be a normal scene without any obvious anomalies, set isAnomaly to false, set the title to "No Anomaly Detected", and provide a description explaining that no issue was found.

Photo: {{media url=photoDataUri}}`,
});

const detectAnomalyFlow = ai.defineFlow(
  {
    name: 'detectAnomalyFlow',
    inputSchema: DetectAnomalyInputSchema,
    outputSchema: DetectAnomalyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
