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

const menuItems = [
  { href: "/browse", label: "Browse", icon: LayoutGrid },
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
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card/50 px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10 backdrop-blur-sm">
            <SidebarTrigger className="md:hidden" />
            <div className="w-full flex-1">
                {/* Header content can go here, like a search bar */}
            </div>
            <div className="flex items-center gap-2">
                <Notifications />
                <UserNav />
            </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
        </main>
        <footer className="bg-card border-t">
          <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center text-sm text-muted-foreground">
              <Link href="/help" className="hover:text-primary">Help</Link>
              <span className="mx-2">|</span>
              <Link href="/complaint" className="hover:text-primary">Complaint</Link>
            </div>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
