
"use server";

// This file is no longer used as report submission to a database has been removed.
// It is kept to prevent breaking imports, but the functions are not called.

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
        throw new Error("Image upload failed. Please update your Storage Security Rules in the Firebase Console to allow unauthenticated writes. For testing, you can use: 'allow read, write: if true;'.");
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
            reportedAt: serverTimestamp(),
            confidence,
        });
    } catch (error) {
        console.error("Error saving report to Firestore:", error);
        throw new Error("Failed to save report data. Please check your Firestore security rules in the Firebase Console.");
    }
 aaa47bc (I see this error with the app, reported by NextJS, please fix it. The er)
}
