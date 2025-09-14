import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header";
import Rightbar from "@/components/RightBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex flex-1 p-4">
          <main className="flex-1 flex justify-center">
            <div className="w-full max-w-3xl flex flex-col items-center">
              {children}
            </div>
          </main>

          <Rightbar />
        </div>
      </div>
    </div>
  );
}
