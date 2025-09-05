"use client";

import * as React from "react";
import { Home, User, Bookmark, FileText } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { NavMain } from "@/components/nav-main";
const data = {
  user: {
    name: "Ahmad Tomeh",
    email: "ahmad@example.com",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "My Profile",
      url: "/profile",
      icon: User,
    },
    {
      title: "My Saved Tools",
      url: "/saved",
      icon: Bookmark,
    },
    {
      title: "My Post",
      url: "/posts",
      icon: FileText,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-start justify-center">
        <span className="font-semibold group-data-[collapsible=icon]:hidden">
          <span className="w-20 h-20 m-2 rounded p-2 bg-sidebar-primary text-sidebar-primary-foreground text-sm font-bold">
            Ai
          </span>
          HBridge
        </span>
        <span className="hidden group-data-[collapsible=icon]:flex items-center justify-center w-8 h-8 rounded bg-sidebar-primary text-sidebar-primary-foreground text-sm font-bold">
          AI
        </span>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
