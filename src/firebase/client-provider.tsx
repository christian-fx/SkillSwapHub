'use client';

import { useEffect, useState } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

import { FirebaseProvider, type FirebaseContextType } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firebase, setFirebase] = useState<FirebaseContextType | null>(null);

  useEffect(() => {
    const apps = initializeFirebase();
    setFirebase(apps);
  }, []);

  if (!firebase) {
    // You can show a loading skeleton here if you want.
    return null; 
  }

  return <FirebaseProvider {...firebase}>{children}</FirebaseProvider>;
}
