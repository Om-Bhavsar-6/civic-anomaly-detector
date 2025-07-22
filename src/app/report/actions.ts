
"use server";

import { detectAnomalyFromImage, type DetectAnomalyFromImageOutput } from "@/ai/flows/detect-anomaly";
import { db, storage } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { z } from "zod";

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

const reportSchema = z.object({
    title: z.string().min(5),
    description: z.string().min(10),
    photoDataUri: z.string(),
});

export async function submitReport(formData: FormData) {
    const rawFormData = {
        title: formData.get('title'),
        description: formData.get('description'),
        photoDataUri: formData.get('photoDataUri'),
    };

    const validatedFields = reportSchema.safeParse(rawFormData);
    if (!validatedFields.success) {
        throw new Error("Invalid form data provided.");
    }

    const { title, description, photoDataUri } = validatedFields.data;

    try {
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `anomalies/${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`);
        const uploadResult = await uploadString(storageRef, photoDataUri, 'data_url');
        const imageUrl = await getDownloadURL(uploadResult.ref);
        const imageHint = "user uploaded"; // Placeholder hint

        // Save report to Firestore
        await addDoc(collection(db, "reports"), {
            title,
            description,
            imageUrl,
            imageHint,
            type: "Other", // Default type for now
            status: "Received",
            reportedAt: new Date(),
        });
    } catch (error) {
        console.error("Error submitting report:", error);
        throw new Error("Failed to submit report.");
    }
}
