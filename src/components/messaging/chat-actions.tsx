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
import { MoreVertical, User, XCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface ChatActionsProps {
  otherUserId: string;
}

export function ChatActions({ otherUserId }: ChatActionsProps) {
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const firestore = useFirestore();
  const { user: authUser } = useUser();
  const { toast } = useToast();

  const handleBlockUser = async () => {
    if (!authUser || !firestore || !otherUserId) return;
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
      setShowBlockDialog(false);
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
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={() => setShowBlockDialog(true)}
          >
            {isBlocked
              ? <><ShieldCheck className="mr-2 h-4 w-4" />Unblock User</>
              : <><XCircle className="mr-2 h-4 w-4" />Block User</>
            }
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBlockUser}
              className={isBlocked ? '' : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'}
            >
              {isBlocked ? 'Unblock' : 'Block User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
