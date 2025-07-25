
"use server";

// This file is no longer used as report submission to a database has been removed.
// It is kept to prevent breaking imports, but the functions are not called.
<<<<<<< HEAD

export async function submitReport(formData: FormData) {
    console.log("Report submission is disabled.");
    // No-op
=======
import { z } from "zod";
import { AnomalyType } from "@/lib/types";

const reportSchema = z.object({
    photoDataUri: z.string().min(1, "Image is required."),
    anomalyType: z.nativeEnum(AnomalyType, { errorMap: () => ({ message: "Invalid anomaly type." }) }),
    title: z.string().min(1, "Title is required."),
    description: z.string().min(1, "Description is required."),
    confidence: z.coerce.number(),
});

export async function submitReport(formData: FormData) {
    console.log("Report submission is disabled.");
    // This function is currently a no-op as Firebase submission has been removed.
>>>>>>> f81069a0acac47bd7d74ae405306fadba168e8a8
}
