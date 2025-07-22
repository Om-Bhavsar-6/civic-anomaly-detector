Civic Anomaly Detector

This is a Next.js application that leverages AI to detect urban anomalies from user-uploaded images. It provides real-time analysis, suggests solutions, and offers contact information for relevant authorities, empowering citizens to help improve their communities.

![Civic Anomaly Detector Screenshot] (<img width="1607" height="913" alt="image" src="https://github.com/user-attachments/assets/fa8d0c88-f56b-49f6-af70-0b67a8d6bcfb" />)


Features

Real-Time Anomaly Detection: Upload an image of a potential civic issue (like a pothole or graffiti) and get an instant AI-powered analysis.
Detailed Analysis Pop-up: The analysis result is presented in a clean pop-up dialog, which includes:
  A determination of whether an anomaly was found.
  A confidence score (as a percentage) for the detection.
  A suggested solution and a practical fix-it tip.
Official Contact Information: For unresolved issues, the app provides official contact details for India's Ministry of Road Transport and Highways (MoRTH).
Modern and Responsive UI: Built with Next.js, React, and ShadCN UI components for a seamless experience on both desktop and mobile devices.
Community Reports Showcase: The homepage features a section displaying recent anomaly reports from the community (using placeholder data).

Technology Stack

Framework: [Next.js](https://nextjs.org/) (with App Router)
Language: [TypeScript](https://www.typescriptlang.org/)
UI Components: [Shadcn/ui](https://ui.shadcn.com/)
Styling: [Tailwind CSS](https://tailwindcss.com/)
AI Integration: [Genkit (Google Generative AI)](https://firebase.google.com/docs/genkit)
Icons: [Lucide React](https://lucide.dev/guide/packages/lucide-react)

Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites

[Node.js](https://nodejs.org/) (version 20 or later)
An active Google AI API key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

Installation

Civic-Anomaly-Detector


1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/civic-anomaly-detector.git
    cd civic-anomaly-detector
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    Create a new file named `.env` in the root of your project and add your Google AI API key:
    ```
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```
    This key is required for the AI analysis feature to work.

Running the Application

1.  Start the development server:
    ```bash
    npm run dev
    ```

2.  Open the application in your browser:
    Navigate to [http://localhost:9002](http://localhost:9002).

How It Works

1.  The user navigates to the Report an Anomaly page.
2.  They upload an image from their device.
3.  Upon upload, the image is sent to a Genkit flow running on the server.
4.  The flow uses the Google Gemini model to analyze the image, checking for anomalies like potholes, graffiti, or broken streetlights.
5.  The AI returns a structured response including a title, description, confidence score, a suggested solution, and a fix-it tip.
6.  This information is displayed to the user in a real-time pop-up dialog.
