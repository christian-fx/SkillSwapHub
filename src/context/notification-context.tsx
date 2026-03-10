'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, query, where, onSnapshot, getDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';
import { useChatLayout } from '@/context/chat-layout-context';
import type { Notification, UserProfile } from '@/lib/types';

interface NotificationContextType {
    unreadChatCount: number;
    pendingSwapCount: number;
    notifications: Notification[];
    markAsRead: (id: string, type: 'message' | 'swap' | 'ai') => Promise<void>;
    deleteNotification: (id: string, type: 'message' | 'swap' | 'ai') => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
    unreadChatCount: 0,
    pendingSwapCount: 0,
    notifications: [],
    markAsRead: async () => { },
    deleteNotification: async () => { }
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
    const { activeChatId } = useChatLayout();

    const [unreadChatCount, setUnreadChatCount] = useState(0);
    const [pendingSwapCount, setPendingSwapCount] = useState(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [dismissedNotifs, setDismissedNotifs] = useState<string[]>([]);

    useEffect(() => {
        if (authUser?.uid && firestore) {
            const unsubUser = onSnapshot(doc(firestore, 'users', authUser.uid), (docSnap) => {
                if (docSnap.exists()) {
                    setDismissedNotifs(docSnap.data().dismissedNotifications || []);
                }
            });
            return () => unsubUser();
        }
    }, [authUser, firestore]);

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
                    read: data.read || false,
                    user: userProfile ? { ...userProfile, id: data.senderId } as any : undefined,
                    link: '/my-swaps'
                });
            }

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
                    const isMessageUnread = data.lastMessage.senderId !== authUser.uid && data.lastMessage.read === false;
                    const isCurrentActiveChat = chatDoc.id === activeChatId;

                    if (isMessageUnread && !isCurrentActiveChat) {
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

        // 3. Listen for Declined Swap Requests (where current user was the sender)
        const declinedSwapsCol = collection(firestore, 'swaps');
        const declinedSwapsQuery = query(
            declinedSwapsCol,
            where('senderId', '==', authUser.uid),
            where('status', '==', 'declined')
        );

        const unsubscribeDeclinedSwaps = onSnapshot(declinedSwapsQuery, async (snapshot) => {
            const declinedNotifications: Notification[] = [];
            for (const swapDoc of snapshot.docs) {
                const data = swapDoc.data();

                let userProfile: UserProfile | undefined;
                try {
                    const uSnap = await getDoc(doc(firestore, 'users', data.receiverId));
                    if (uSnap.exists()) userProfile = uSnap.data() as UserProfile;
                } catch (e) { }

                declinedNotifications.push({
                    id: swapDoc.id,
                    type: 'swap',
                    title: 'Swap Declined',
                    description: userProfile ? `${userProfile.name} declined your swap request.` : 'Your swap request was declined.',
                    timestamp: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
                    read: data.read || false,
                    user: userProfile ? { ...userProfile, id: data.receiverId } as any : undefined,
                    link: '/my-swaps'
                });
            }

            // A safer merge is to just overwrite the relevant elements in state, 
            // but since React state updates can batch, let's just use functional updates safely:
            setNotifications(prev => {
                const otherNotifs = prev.filter(n => !declinedNotifications.find(dn => dn.id === n.id));
                return [...otherNotifs, ...declinedNotifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            });

        }, (error) => {
            console.error("Error listening to declined swaps:", error);
        });

        return () => {
            unsubscribeSwaps();
            unsubscribeChats();
            unsubscribeDeclinedSwaps();
        };
    }, [authUser, firestore, activeChatId]);

    const markAsRead = async (id: string, type: 'message' | 'swap' | 'ai') => {
        if (!firestore) return;
        try {
            if (type === 'swap') {
                await updateDoc(doc(firestore, 'swaps', id), { read: true });
            } else if (type === 'message') {
                await updateDoc(doc(firestore, 'chats', id), { 'lastMessage.read': true });
            }
        } catch (e) { console.error("Error marking read:", e); }
    }

    const deleteNotification = async (id: string, type: 'message' | 'swap' | 'ai') => {
        if (!firestore || !authUser) return;
        try {
            // Import arrayUnion at the top, or just use it here inline for simplicity if not imported 
            const { arrayUnion } = await import('firebase/firestore');
            await updateDoc(doc(firestore, 'users', authUser.uid), {
                dismissedNotifications: arrayUnion(id)
            });
        } catch (e) { console.error("Error dismissing notification:", e); }
    }

    // Filter out dismissed notifications
    const visibleNotifications = notifications.filter(n => !dismissedNotifs.includes(n.id));

    // Also recalculate counts based on exactly what is visible
    const visibleUnreadChatCount = visibleNotifications.filter(n => n.type === 'message' && !n.read).length;
    const visiblePendingSwapCount = visibleNotifications.filter(n => n.type === 'swap' && !n.read).length;

    return (
        <NotificationContext.Provider value={{ unreadChatCount: visibleUnreadChatCount, pendingSwapCount: visiblePendingSwapCount, notifications: visibleNotifications, markAsRead, deleteNotification }}>
            {children}
        </NotificationContext.Provider>
    );
}
