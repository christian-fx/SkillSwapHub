# SkillSwap Hub

![SkillSwap Hub](https://images.unsplash.com/photo-1764173039318-75d362d60af8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxjb21tdW5pdHklMjBsZWFybmluZ3xlbnwwfHx8fDE3NjUxMTA2NzB8MA&ixlib=rb-4.1.0&q=80&w=1080)

SkillSwap Hub is a modern, full-stack web application that connects a community of learners and mentors. It allows users to trade their talents, learn new skills, and grow together in a collaborative environment.

## ✨ Key Features

- **User Authentication:** Secure sign-up and login with Email/Password, Google, and Phone (OTP).
- **Profile Management:** Create and customize user profiles, showcasing skills offered and skills needed.
- **Skill Discovery:** Browse and search for other users with advanced filtering, sorting, and search capabilities.
- **AI-Powered Recommendations:** Utilizes **Google's Genkit** to provide intelligent suggestions for skill swaps and user matches.
- **Real-time Messaging:** A built-in chat system for users to communicate and coordinate swaps.
- **Marketplace:** A platform for experts to sell digital goods like eBooks, templates, and guides.
- **Swap Management:** A dedicated dashboard to track the status of all proposed, accepted, and completed swaps.
- **Responsive Design:** A beautiful and modern interface built with ShadCN UI and Tailwind CSS, ensuring a great experience on all devices.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Generative AI:** [Google Genkit](https://firebase.google.com/docs/genkit)
- **Backend & Database:** [Firebase](https://firebase.google.com/) (Authentication, Firestore)
- **Form Management:** [React Hook Form](https://react-hook-form.com/)
- **Schema Validation:** [Zod](https://zod.dev/)

## 🚀 Getting Started & Deployment

Follow these instructions to get your local copy running, push it to GitHub, and deploy it to the web.

### 1. Local Setup

First, get the application running on your local machine.

- **Prerequisites:** Make sure you have [Node.js](https://nodejs.org/) (v18 or newer) installed.

- **Install dependencies:**
  ```bash
  npm install
  ```

- **Set up Firebase:**
  1. Create a new project on the [Firebase Console](https://console.firebase.google.com/).
  2. In your project, go to **Project Settings** > **General**.
  3. Under "Your apps", create a new Web app.
  4. Copy the `firebaseConfig` object. You will need these values for your environment variables.
  5. Go to **Authentication** > **Sign-in method** and enable **Email/Password**, **Google**, and **Phone** providers.
  6. Go to **Firestore Database** and create a new database in production mode.
  7. Copy the rules from `firestore.rules` and paste them into the **Rules** tab of your Firestore database.

- **Set up Environment Variables:**
  1. Create a `.env.local` file in the root of your project.
  2. Add the Firebase and Genkit API keys. It should look like this:
     ```env
     # Firebase Config (for the browser)
     NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
     NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
     NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID

     # Genkit AI Config (for the server)
     GEMINI_API_KEY=YOUR_GOOGLE_AI_API_KEY
     ```
  3. **Important:** Your `GEMINI_API_KEY` is a server-side secret and should NOT have the `NEXT_PUBLIC_` prefix.

- **Run the development server:**
  ```bash
  npm run dev
  ```
  The application should now be running on http://localhost:9002.

### 2. Pushing to Your GitHub Repository

Next, push your project code to your GitHub repository.

1.  **Initialize a Git repository in your project folder:**
    ```bash
    git init -b main
    ```
 
2.  **Add all the files to the staging area:**
    ```bash
    git add .
    ```

3.  **Commit the files:**
    ```bash
    git commit -m "Initial commit of SkillSwap Hub project"
    ```

4.  **Link your local repository to the remote one on GitHub:**
    ```bash
    git remote add origin https://github.com/christian-fx/Skillswap-Hub.git
    ```

5.  **Push your code to GitHub:**
    ```bash
    git push -u origin main
    ```

### 3. Deploying to Vercel

With your code on GitHub, you can now deploy it live on the web with [Vercel](https://vercel.com).

1.  **Import Project on Vercel:** Go to your Vercel dashboard and import the GitHub repository you just created.
2.  **Configure Environment Variables:** During the import process, Vercel will ask for your environment variables. Copy all the keys and values from your `.env.local` file and add them to your Vercel project's settings.
3.  **Deploy:** Click the "Deploy" button. Vercel will handle the rest!

---

This project was bootstrapped with Firebase Studio.
