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
    - Copy the `firebaseConfig` object and paste it into `src/firebase/config.ts`.
    - Go to **Authentication** > **Sign-in method** and enable **Email/Password**, **Google**, and **Phone** providers.
    - Go to **Firestore Database** and create a new database in production mode.
    - Copy the rules from `firestore.rules` and paste them into the **Rules** tab of your Firestore database.

4.  **Set up Environment Variables:**
    - Create a `.env.local` file at the root of your project.
    - If you are using AI features with Genkit, add your Google AI API key:
      ```
      GEMINI_API_KEY=YOUR_GOOGLE_AI_API_KEY
      ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

    The application should now be running on [http://localhost:3000](http://localhost:3000).

## ☁️ Deployment

This application is optimized for deployment on [Firebase App Hosting](https://firebase.google.com/docs/app-hosting).

- Connect your GitHub repository to a Firebase App Hosting backend.
- The `apphosting.yaml` file provides the necessary run configuration.
- Firebase will automatically handle the build and deployment process.

---

This project was bootstrapped with Firebase Studio.
