'use client';

import { MessageCircle } from "lucide-react";

export function WelcomeMessage() {
    return (
        <div className="hidden md:flex flex-col items-center justify-center h-full border rounded-lg bg-card">
            <MessageCircle className="h-16 w-16 text-muted-foreground/50" />
            <h2 className="mt-4 text-xl font-semibold">Your Messages</h2>
            <p className="text-muted-foreground mt-1">Select a conversation to start chatting.</p>
        </div>
    )
}
