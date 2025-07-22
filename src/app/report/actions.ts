
"use server";

import { db, storage } from "@/lib/firebase";
import { AnomalyType } from "@/lib/types";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { z } from "zod";

const reportSchema = z.object({
    photoDataUri: z.string(),
    anomalyType: z.nativeEnum(AnomalyType),
});

export async function submitReport(formData: FormData) {
    const rawFormData = {
        photoDataUri: formData.get('photoDataUri'),
        anomalyType: formData.get('anomalyType'),
    };

    const validatedFields = reportSchema.safeParse(rawFormData);
    if (!validatedFields.success) {
        throw new Error("Invalid form data provided.");
    }

    const { photoDataUri, anomalyType } = validatedFields.data;

    try {
        const title = `${anomalyType} Report`;
        const description = `A new ${anomalyType} has been reported.`;

        // Upload image to Firebase Storage
        const storageRef = ref(storage, `anomalies/${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`);
        const uploadResult = await uploadString(storageRef, photoDataUri, 'data_url');
        const imageUrl = await getDownloadURL(uploadResult.ref);
        const imageHint = anomalyType.toLowerCase();

        // Save report to Firestore
        await addDoc(collection(db, "reports"), {
            title,
            description,
            imageUrl,
            imageHint,
            type: anomalyType,
            status: "Received",
            reportedAt: new Date(),
        });
    } catch (error) {
        console.error("Error submitting report:", error);
        throw new Error("Failed to submit report.");
    }
}
