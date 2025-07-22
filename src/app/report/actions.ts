
"use server";

import { db, storage } from "@/lib/firebase";
import { AnomalyType } from "@/lib/types";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { z } from "zod";

const reportSchema = z.object({
    photoDataUri: z.string().min(1, "Image is required."),
    anomalyType: z.nativeEnum(AnomalyType, { errorMap: () => ({ message: "Invalid anomaly type." }) }),
    title: z.string().min(1, "Title is required."),
    description: z.string().min(1, "Description is required."),
});

export async function submitReport(formData: FormData) {
    const rawFormData = {
        photoDataUri: formData.get('photoDataUri'),
        anomalyType: formData.get('anomalyType'),
        title: formData.get('title'),
        description: formData.get('description'),
    };

    const validatedFields = reportSchema.safeParse(rawFormData);
    if (!validatedFields.success) {
        console.error("Form validation failed:", validatedFields.error.flatten().fieldErrors);
        throw new Error("Invalid form data provided.");
    }

    const { photoDataUri, anomalyType, title, description } = validatedFields.data;

    let imageUrl;
    try {
        const storageRef = ref(storage, `anomalies/${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`);
        await uploadString(storageRef, photoDataUri, 'data_url');
        imageUrl = await getDownloadURL(storageRef);
    } catch (error) {
        console.error("Error uploading image to Firebase Storage:", error);
        throw new Error("Failed to upload image. Please check your Firebase Storage security rules in the Firebase Console.");
    }

    try {
        const imageHint = anomalyType.toLowerCase();

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
        console.error("Error saving report to Firestore:", error);
        throw new Error("Failed to save report data. Please check your Firestore security rules in the Firebase Console.");
    }
}
