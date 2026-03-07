
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  MessageCircle,
  Settings,
  User,
  X,
  ShoppingBasket,
  ShoppingCart,
  RefreshCw,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserNav } from "@/components/user-nav";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Notifications } from "@/components/notifications";
import { useChatLayout } from "@/context/chat-layout-context";
import { EmailVerificationModal } from "@/components/auth/email-verification-modal";

const menuItems = [
  { href: "/browse", label: "Swaps", icon: LayoutGrid },
  { href: "/my-swaps", label: "My Swaps", icon: RefreshCw },
  { href: "/marketplace", label: "Marketplace", icon: ShoppingBasket },
  { href: "/cart", label: "Bookings", icon: ShoppingCart },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/settings", label: "Settings", icon: Settings },
];

function DashboardNav() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    setOpenMobile(false);
  }

  return (
    <>
      <SidebarHeader className="flex items-center justify-between">
        <Logo />
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpenMobile(false)}>
          <X />
          <span className="sr-only">Close Sidebar</span>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} onClick={handleLinkClick}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  className="text-base"
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  )
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { isChatOpen } = useChatLayout();
  const pathname = usePathname();
  const isMessagesPage = pathname.startsWith('/messages');
  const hideLayout = isMessagesPage && isChatOpen;

  return (
    <SidebarInset>
      <header className={cn(
        "flex h-14 items-center justify-between gap-4 border-b bg-card/50 px-4 lg:h-[60px] lg:px-6 sticky top-0 z-20 backdrop-blur-sm",
        hideLayout && "hidden"
      )}>
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <div className="hidden md:block">
            {/* Desktop-only header content can go here */}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 flex-shrink-0">
          <Notifications />
          <UserNav />
        </div>
      </header>
      <main className={cn(
        "flex flex-1 flex-col",
        !hideLayout && "gap-4 p-4 lg:gap-6 lg:p-6",
        isMessagesPage && !isChatOpen && "p-0",
        hideLayout && "h-[calc(100svh)]"
      )}>
        {children}
        <EmailVerificationModal />
      </main>
      <footer className={cn(
        "bg-card border-t",
        hideLayout && "hidden"
      )}>
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center text-sm text-muted-foreground">
            <Link href="/help" className="hover:text-primary">Help</Link>
            <span className="mx-2">|</span>
            <Link href="/complaint" className="hover:text-primary">Complaint</Link>
          </div>
        </div>
      </footer>
    </SidebarInset>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <SidebarProvider>
      <Sidebar>
        <DashboardNav />
      </Sidebar>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}
