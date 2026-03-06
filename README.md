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

## 🚀 Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- `npm`, `yarn`, or `pnpm`

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/skillswap-hub.git
    cd skillswap-hub
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Firebase:**
    - Create a new project on the [Firebase Console](https://console.firebase.google.com/).
    - In your project, go to **Project Settings** > **General**.
    - Under "Your apps", create a new Web app.
    - Copy the `firebaseConfig` object. You will need these values for your environment variables in the next step.
    - Go to **Authentication** > **Sign-in method** and enable **Email/Password**, **Google**, and **Phone** providers.
    - Go to **Firestore Database** and create a new database in production mode.
    - Copy the rules from `firestore.rules` and paste them into the **Rules** tab of your Firestore database.

4.  **Set up Environment Variables:**
    - Create a `.env.local` file in the root of your project.
    - Add the Firebase configuration values you copied in the previous step. It should look like this:

      ```env
      # Firebase Config
      NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
      NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
      NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
      NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID

      # Genkit AI Config (used server-side)
      GEMINI_API_KEY=YOUR_GOOGLE_AI_API_KEY
      ```
    - **Important:** Environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Be careful not to expose sensitive keys. The `GEMINI_API_KEY` is used server-side and should NOT have the prefix.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

    The application should now be running on [http://localhost:3000](http://localhost:3000).

## 📁 Pushing to GitHub

If you've initialized this project locally and want to push it to a new GitHub repository, follow these steps:

1.  **Initialize a new Git repository in your project folder:**
    ```bash
    git init -b main
    ```

2.  **Add all the files to the staging area:**
    ```bash
    git add .
    ```

3.  **Commit the files with an initial message:**
    ```bash
    git commit -m "Initial commit"
    ```

4.  **Go to [GitHub](https://github.com/new) and create a new, empty repository.** Do not initialize it with a README or license file.

5.  **Copy the repository URL** provided by GitHub. It will look like this: `https://github.com/your-username/your-repo-name.git`.

6.  **Link your local repository to the remote one on GitHub:**
    ```bash
    git remote add origin https://github.com/your-username/your-repo-name.git
    ```

7.  **Push your local commit to the remote repository:**
    ```bash
    git push -u origin main
    ```

## ☁️ Deployment

This application is ready for deployment on modern hosting platforms that support Next.js.

### Option 1: Vercel (Recommended for Next.js)

You can easily deploy this project to [Vercel](https://vercel.com).

1.  **Push your code to GitHub:** Make sure your latest code is on your GitHub repository.
2.  **Import Project on Vercel:** Go to your Vercel dashboard and import the GitHub repository.
3.  **Configure Environment Variables:** During the import process, Vercel will ask for your environment variables. Copy all the keys and values from your `.env.local` file and add them to your Vercel project settings.
4.  **Deploy:** Click the "Deploy" button. Vercel will build and deploy your application.

### Option 2: Firebase App Hosting

This application is also optimized for deployment on [Firebase App Hosting](https://firebase.google.com/docs/app-hosting).

- Connect your GitHub repository to a Firebase App Hosting backend.
- The `apphosting.yaml` file provides the necessary run configuration.
- You will need to configure the environment variables from your `.env.local` file in the App Hosting settings for the backend to connect to your Firebase project and AI services.
- Firebase will automatically handle the build and deployment process.

---

This project was bootstrapped with Firebase Studio.
