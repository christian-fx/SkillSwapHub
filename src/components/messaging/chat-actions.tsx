'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { MoreVertical, User, XCircle, ShieldCheck, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface ChatActionsProps {
  otherUserId: string;
  conversationId: string;
  onChatDeleted?: () => void;
}

export function ChatActions({ otherUserId, conversationId, onChatDeleted }: ChatActionsProps) {
  const [dialog, setDialog] = useState<'block' | 'delete' | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const firestore = useFirestore();
  const { user: authUser } = useUser();
  const { toast } = useToast();

  const handleBlockUser = async () => {
    if (!authUser || !firestore || !otherUserId) return;
    setIsLoading(true);
    try {
      const userRef = doc(firestore, 'users', authUser.uid);
      if (isBlocked) {
        await updateDoc(userRef, { blockedUsers: arrayRemove(otherUserId) });
        setIsBlocked(false);
        toast({ title: 'User unblocked', description: 'You can now receive messages from this user.' });
      } else {
        await updateDoc(userRef, { blockedUsers: arrayUnion(otherUserId) });
        setIsBlocked(true);
        toast({ title: 'User blocked', description: 'You will no longer receive messages from this user.' });
      }
    } catch (error) {
      console.error('Block user error:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not block user. Please try again.' });
    } finally {
      setIsLoading(false);
      setDialog(null);
    }
  };

  const handleDeleteChat = async () => {
    if (!firestore || !conversationId) return;
    setIsLoading(true);
    try {
      await deleteDoc(doc(firestore, 'chats', conversationId));
      toast({ title: 'Chat deleted', description: 'This conversation has been removed.' });
      onChatDeleted?.();
    } catch (error) {
      console.error('Delete chat error:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete chat. Please try again.' });
    } finally {
      setIsLoading(false);
      setDialog(null);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/profile/${otherUserId}`} className="flex items-center cursor-pointer w-full">
              <User className="mr-2 h-4 w-4" />
              View Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* Use e.preventDefault() to stop the dropdown from closing before dialog opens */}
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={(e) => { e.preventDefault(); setDialog('block'); }}
          >
            {isBlocked
              ? <><ShieldCheck className="mr-2 h-4 w-4" />Unblock User</>
              : <><XCircle className="mr-2 h-4 w-4" />Block User</>
            }
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={(e) => { e.preventDefault(); setDialog('delete'); }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Chat
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Block / Unblock Dialog */}
      <AlertDialog open={dialog === 'block'} onOpenChange={(open) => !open && setDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isBlocked ? 'Unblock User?' : 'Block User?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {isBlocked
                ? 'This user will be able to send you messages again.'
                : 'This user will no longer be able to send you messages. You can unblock them at any time.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBlockUser}
              disabled={isLoading}
              className={isBlocked ? '' : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'}
            >
              {isLoading ? 'Processing...' : (isBlocked ? 'Unblock' : 'Block User')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Chat Dialog */}
      <AlertDialog open={dialog === 'delete'} onOpenChange={(open) => !open && setDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this conversation and all its messages for you. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteChat}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? 'Deleting...' : 'Delete Chat'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
