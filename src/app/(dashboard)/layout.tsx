"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  MessageCircle,
  Settings,
  User,
  Twitter,
  Facebook,
  Linkedin,
  Github,
  Youtube,
  Rss,
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
} from "@/components/ui/sidebar";
import { UserNav } from "@/components/user-nav";
import { Logo } from "@/components/logo";

const socialLinks = [
    { icon: <Twitter />, href: "#" },
    { icon: <Facebook />, href: "#" },
    { icon: <Linkedin />, href: "#" },
    { icon: <Github />, href: "#" },
    { icon: <Youtube />, href: "#" },
    { icon: <Rss />, href: "#" },
  ];


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { href: "/browse", label: "Browse", icon: LayoutGrid },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/messages", label: "Messages", icon: MessageCircle },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card/50 px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10 backdrop-blur-sm">
            <SidebarTrigger className="md:hidden" />
            <div className="w-full flex-1">
                {/* Header content can go here, like a search bar */}
            </div>
            <UserNav />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
        </main>
        <footer className="bg-card border-t">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div>
                <Logo />
                <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                Exchange skills, enrich your life. Join a community of learners and mentors.
                </p>
                <div className="mt-8 flex space-x-4">
                    {socialLinks.map((link, index) => (
                        <Link key={index} href={link.href} className="text-muted-foreground hover:text-primary">
                            {link.icon}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 lg:col-span-2 sm:grid-cols-4">
                <div>
                <p className="font-medium text-foreground">Company</p>
                <ul className="mt-4 space-y-2 text-sm">
                    <li><Link href="#" className="text-muted-foreground hover:text-primary">About</Link></li>
                    <li><Link href="#" className="text-muted-foreground hover:text-primary">Careers</Link></li>
                    <li><Link href="#" className="text-muted-foreground hover:text-primary">Blog</Link></li>
                </ul>
                </div>
                <div>
                <p className="font-medium text-foreground">Community</p>
                <ul className="mt-4 space-y-2 text-sm">
                    <li><Link href="#" className="text-muted-foreground hover:text-primary">Guidelines</Link></li>
                    <li><Link href="#" className="text-muted-foreground hover:text-primary">Events</Link></li>
                    <li><Link href="#" className="text-muted-foreground hover:text-primary">Forum</Link></li>
                </ul>
                </div>
                <div>
                <p className="font-medium text-foreground">Support</p>
                <ul className="mt-4 space-y-2 text-sm">
                    <li><Link href="#" className="text-muted-foreground hover:text-primary">Help Center</Link></li>
                    <li><Link href="#" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
                    <li><Link href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                </ul>
                </div>
                 <div>
                <p className="font-medium text-foreground">Legal</p>
                <ul className="mt-4 space-y-2 text-sm">
                    <li><Link href="#" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
                    <li><Link href="#" className="text-muted-foreground hover:text-primary">Cookie Policy</Link></li>
                </ul>
                </div>
            </div>
            </div>
            <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} SkillSwap Hub. All rights reserved.</p>
            </div>
        </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}

    