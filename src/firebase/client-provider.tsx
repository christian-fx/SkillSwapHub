'use client';

import { useEffect, useState } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage'; // Added import for Storage

import { FirebaseProvider, type FirebaseContextType } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [firebase, setFirebase] = useState<ReturnType<typeof initializeFirebase> | null>(null);

  useEffect(() => {
    setFirebase(initializeFirebase());
  }, []);

  if (!firebase) {
    // You can show a loading skeleton here if you want.
    return null;
  }

  return (
    <FirebaseProvider firebaseApp={firebase.firebaseApp} auth={firebase.auth} firestore={firebase.firestore} storage={firebase.storage}>
      {children}
    </FirebaseProvider>
  );
}
