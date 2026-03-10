
'use client';

import { useState } from 'react';
import { Bell, MessageCircle, RefreshCw, Zap, CheckCheck, Check, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import type { Notification } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useNotifications } from '@/context/notification-context';

const NOTIFICATION_ICONS = {
  message: <MessageCircle className="h-5 w-5" />,
  swap: <RefreshCw className="h-5 w-5 text-green-500" />,
  ai: <Zap className="h-5 w-5 text-purple-500" />,
};

function NotificationItem({ notification }: { notification: Notification }) {
  const Icon = NOTIFICATION_ICONS[notification.type];
  const avatar = notification.user?.avatarUrl;
  const { markAsRead, deleteNotification } = useNotifications();

  return (
    <div className="relative group block hover:bg-accent -mx-2 px-2 rounded-lg">
      <Link href={notification.link || "#"} className="flex items-start gap-3 py-3 relative pr-16">
        <div className="flex-shrink-0">
          {avatar ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatar} alt={notification.user?.name} data-ai-hint={notification.user?.avatarHint} />
              <AvatarFallback>{notification.user?.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              {Icon}
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium pr-2">{notification.title}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {notification.description}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(notification.timestamp), {
              addSuffix: true,
            })}
          </p>
        </div>
        {!notification.read && (
          <div className="h-2.5 w-2.5 rounded-full bg-primary mt-1 absolute right-2 top-4" />
        )}
      </Link>

      {/* Action Buttons on Hover */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-background/95 backdrop-blur-sm p-1 rounded-md shadow-sm border transition-opacity z-10">
        {!notification.read && (
          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-green-500/10" onClick={(e) => { e.preventDefault(); e.stopPropagation(); markAsRead(notification.id, notification.type); }}>
            <Check className="h-4 w-4 text-green-600" />
            <span className="sr-only">Mark as read</span>
          </Button>
        )}
        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-destructive/10" onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteNotification(notification.id, notification.type); }}>
          <Trash2 className="h-4 w-4 text-destructive" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
    </div>
  );
}

export function Notifications() {
  const { notifications, markAsRead } = useNotifications();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    for (const n of unread) {
      await markAsRead(n.id, n.type);
    }
  };

  const allNotifications = notifications;
  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 justify-center rounded-full p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96" align="end">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="mr-2 h-4 w-4" /> Mark all as read
            </Button>
          )}
        </div>
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="max-h-96 overflow-y-auto space-y-2">
            {allNotifications.length > 0 ? (
              allNotifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            ) : (
              <p className="text-sm text-center text-muted-foreground py-8">No notifications yet.</p>
            )}
          </TabsContent>
          <TabsContent value="unread" className="max-h-96 overflow-y-auto space-y-2">
            {unreadNotifications.length > 0 ? (
              unreadNotifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            ) : (
              <p className="text-sm text-center text-muted-foreground py-8">No unread notifications.</p>
            )}
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
