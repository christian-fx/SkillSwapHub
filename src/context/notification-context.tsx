'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';
import type { Notification, UserProfile } from '@/lib/types';

interface NotificationContextType {
    unreadChatCount: number;
    pendingSwapCount: number;
    notifications: Notification[];
}

const NotificationContext = createContext<NotificationContextType>({
    unreadChatCount: 0,
    pendingSwapCount: 0,
    notifications: [],
});

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export function NotificationProvider({ children }: { children: ReactNode }) {
    const { user: authUser } = useUser();
    const firestore = useFirestore();

    const [unreadChatCount, setUnreadChatCount] = useState(0);
    const [pendingSwapCount, setPendingSwapCount] = useState(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (!authUser || !firestore) {
            setUnreadChatCount(0);
            setPendingSwapCount(0);
            setNotifications([]);
            return;
        }

        // 1. Listen for Pending Swap Requests (where current user is the receiver)
        const swapsCol = collection(firestore, 'swaps');
        const swapsQuery = query(
            swapsCol,
            where('receiverId', '==', authUser.uid),
            where('status', '==', 'pending')
        );

        const unsubscribeSwaps = onSnapshot(swapsQuery, async (snapshot) => {
            setPendingSwapCount(snapshot.empty ? 0 : snapshot.docs.length);

            const newNotifications: Notification[] = [];
            for (const swapDoc of snapshot.docs) {
                const data = swapDoc.data();
                let userProfile: UserProfile | undefined;
                try {
                    const uSnap = await getDoc(doc(firestore, 'users', data.senderId));
                    if (uSnap.exists()) userProfile = uSnap.data() as UserProfile;
                } catch (e) { }

                newNotifications.push({
                    id: swapDoc.id,
                    type: 'swap',
                    title: 'New Swap Request',
                    description: userProfile ? `${userProfile.name} wants to swap with you.` : 'Someone wants to swap with you.',
                    timestamp: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
                    read: false,
                    user: userProfile ? { ...userProfile, id: data.senderId } as any : undefined,
                    link: '/my-swaps'
                });
            }
            // Store them in a ref or global variable or local state, we'll merge them in the render or a combined effect.
            // For simplicity, we manage notifications arrays per source and merge them visually or in state.
            setNotifications(prev => {
                const filtered = prev.filter(n => n.type !== 'swap');
                return [...filtered, ...newNotifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            });

        }, (error) => {
            console.error("Error listening to swaps for badges:", error);
        });

        // 2. Listen for Unread Chats (where current user is a participant)
        const chatsCol = collection(firestore, 'chats');
        const chatsQuery = query(
            chatsCol,
            where('participants', 'array-contains', authUser.uid)
        );

        const unsubscribeChats = onSnapshot(chatsQuery, async (snapshot) => {
            let unreadCount = 0;
            const chatNotifications: Notification[] = [];

            for (const chatDoc of snapshot.docs) {
                const data = chatDoc.data();
                if (data.lastMessage) {
                    if (data.lastMessage.senderId !== authUser.uid && data.lastMessage.read === false) {
                        unreadCount++;
                        let userProfile: UserProfile | undefined;
                        try {
                            const uSnap = await getDoc(doc(firestore, 'users', data.lastMessage.senderId));
                            if (uSnap.exists()) userProfile = uSnap.data() as UserProfile;
                        } catch (e) { }

                        chatNotifications.push({
                            id: chatDoc.id,
                            type: 'message',
                            title: userProfile ? `New message from ${userProfile.name}` : 'New Message',
                            description: data.lastMessage.text || 'You received a new message.',
                            timestamp: data.lastMessage.createdAt?.toDate ? data.lastMessage.createdAt.toDate().toISOString() : new Date().toISOString(),
                            read: false,
                            user: userProfile ? { ...userProfile, id: data.lastMessage.senderId } as any : undefined,
                            link: '/messages'
                        });
                    }
                }
            }
            setUnreadChatCount(unreadCount);

            setNotifications(prev => {
                const filtered = prev.filter(n => n.type !== 'message');
                return [...filtered, ...chatNotifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            });

        }, (error) => {
            console.error("Error listening to chats for badges:", error);
        });

        return () => {
            unsubscribeSwaps();
            unsubscribeChats();
        };
    }, [authUser, firestore]);

    return (
        <NotificationContext.Provider value={{ unreadChatCount, pendingSwapCount, notifications }}>
            {children}
        </NotificationContext.Provider>
    );
}
