# SkillSwap Hub

![SkillSwap Hub](https://images.unsplash.com/photo-1764173039318-75d362d60af8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxjb21tdW5pdHklMjBsZWFybmluZ3xlbnwwfHx8fDE3NjUxMTA2NzB8MA&ixlib=rb-4.1.0&q=80&w=1080)

SkillSwap Hub is a modern, full-stack web application that connects a community of learners and mentors. It allows users to trade their talents, learn new skills, and grow together in a collaborative environment.

## ✨ Key Features

- **User Authentication:** Secure sign-up and login with Email/Password, Google, and Phone (OTP).
- **Profile Management:** Create and customize user profiles, showcasing skills offered and skills needed.
- **Skill Discovery:** Browse and search for other users with advanced filtering, sorting, and search capabilities.
- **AI-Powered Recommendations:** Utilizes **Google Genkit** (powered by Gemini 2.0 Flash) to provide intelligent suggestions for skill swaps and user matches.
- **Real-time Messaging:** A built-in chat system for users to communicate and coordinate swaps.
- **Marketplace:** A platform for experts to sell digital goods like eBooks, templates, and guides.
- **Swap Management:** A dedicated dashboard to track the status of all proposed, accepted, and completed swaps.
- **Responsive Design:** A beautiful and modern interface built with ShadCN UI (featuring dynamic Skeleton loading states) and Tailwind CSS, ensuring a great experience on all devices.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **UI & Styling:** [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/) (Radix Primitives)
- **Generative AI:** [Google Genkit](https://firebase.google.com/docs/genkit) (Gemini API)
- **Backend & Database:** [Firebase 11](https://firebase.google.com/) (Authentication, Firestore)
- **Form Management:** React Hook Form & Zod

## 🚀 Getting Started

### 1. Local Setup

Make sure you have [Node.js](https://nodejs.org/) (v18+) installed.

```bash
# Clone or download the repository, then install dependencies:
npm install
```

### 2. Set up Firebase

1. Create a new project on the [Firebase Console](https://console.firebase.google.com/).
2. In your project, go to **Project Settings** > **General** and create a new Web app.
3. Keep the `firebaseConfig` object handy.
4. Go to **Authentication > Sign-in method** and enable:
   - **Email/Password**
   - **Google**
   - **Phone** 
     - *⚠️ Note: Phone Authentication requires your Firebase project to be on the **Blaze (pay-as-you-go) billing plan** to send real SMS. To test phone auth without a credit card, add a "Test Phone Number" in the Firebase console.*
5. Go to **Firestore Database** and create a new database.
6. Copy the rules from `firestore.rules` in this project and paste them into the **Rules** tab of your Firestore database.

### 3. Environment Variables

Create a `.env.local` file in the root of your project using `.env.local.example` as a template:

```bash
cp .env.local.example .env.local
```

Populate it with your Firebase keys and a free Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

```env
# Firebase Config (Browser)
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID

# Genkit AI Config (Server)
GEMINI_API_KEY=YOUR_GOOGLE_AI_API_KEY
```

### 4. Run the App

Start the Turbopack development server:

```bash
npm run dev
```
The application should now be running on `http://localhost:9002`.

---
*Built with modern web standards for a seamless, interactive experience.*
