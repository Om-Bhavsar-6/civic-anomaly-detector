
"use server";

<<<<<<< HEAD
 HEAD
// This file is no longer used as report submission to a database has been removed.
// It is kept to prevent breaking imports, but the functions are not called.

=======
>>>>>>> 2df0985 (Remove AI analysis of the images And why is the image submission failing)
import { db, storage } from "@/lib/firebase";
import { AnomalyType } from "@/lib/types";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { z } from "zod";

const reportSchema = z.object({
 HEAD
    photoDataUri: z.string().min(1, "Image is required."),
    anomalyType: z.nativeEnum(AnomalyType, { errorMap: () => ({ message: "Invalid anomaly type." }) }),
    title: z.string().min(1, "Title is required."),
    description: z.string().min(1, "Description is required."),
    confidence: z.coerce.number(),

    photoDataUri: z.string().min(1, "Image data URI is required."),
    anomalyType: z.nativeEnum(AnomalyType, { errorMap: () => ({ message: "Invalid anomaly type." }) }),
 62d7698 (I see this error with the app, reported by NextJS, please fix it. The er)
});
 17bf9d7 (also remove the details section. And when you click on submit report a P)

export async function submitReport(formData: FormData) {
 HEAD
    console.log("Report submission is disabled.");
    // No-op

    const rawFormData = {
        photoDataUri: formData.get('photoDataUri'),
        anomalyType: formData.get('anomalyType'),
        title: formData.get('title'),
        description: formData.get('description'),
        confidence: formData.get('confidence'),
    };

    const validatedFields = reportSchema.safeParse(rawFormData);
    if (!validatedFields.success) {
        console.error("Form validation failed:", validatedFields.error.flatten().fieldErrors);
        throw new Error("Invalid form data provided.");
    }

    const { photoDataUri, anomalyType, title, description, confidence } = validatedFields.data;

    let imageUrl;
    try {
        const storageRef = ref(storage, `anomalies/${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`);
        await uploadString(storageRef, photoDataUri, 'data_url');
        imageUrl = await getDownloadURL(storageRef);
    } catch (error) {
        console.error("Error uploading image to Firebase Storage:", error);
 HEAD
        throw new Error("Image upload failed. Please update your Storage Security Rules in the Firebase Console to allow unauthenticated writes. For testing, you can use: 'allow read, write: if true;'.");

        throw new Error("Failed to upload image. Please check your Firebase Storage security rules in the Firebase Console.");
 24ef055 (I see this error with the app, reported by NextJS, please fix it. The er)
    }

    let imageUrl;
    try {
        const storageRef = ref(storage, `anomalies/${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`);
        await uploadString(storageRef, photoDataUri, 'data_url');
        imageUrl = await getDownloadURL(storageRef);
    } catch (error) {
        console.error("Error uploading image to Firebase Storage:", error);
        throw new Error("Failed to upload image.");
    }

    try {
 HEAD
 HEAD

        const title = `${anomalyType} Report`;
        const description = `A new ${anomalyType} has been reported.`;
 2df0985 (Remove AI analysis of the images And why is the image submission failing)

        const title = `${anomalyType} Report`;
        const description = `A new ${anomalyType} has been reported.`;
 62d7698 (I see this error with the app, reported by NextJS, please fix it. The er)
        const imageHint = anomalyType.toLowerCase();

        await addDoc(collection(db, "reports"), {
            title,
            description,
            imageUrl,
            imageHint,
            type: anomalyType,
            status: "Received",
            reportedAt: serverTimestamp(),
            confidence,
        });
    } catch (error) {
        console.error("Error saving report to Firestore:", error); HEAD
        throw new Error("Failed to save report data. Please check your Firestore security rules in the Firebase Console.");

        throw new Error("Failed to save report data.");
 62d7698 (I see this error with the app, reported by NextJS, please fix it. The er)
    }
 aaa47bc (I see this error with the app, reported by NextJS, please fix it. The er)
}
