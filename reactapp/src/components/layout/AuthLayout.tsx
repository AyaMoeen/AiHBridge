// src/layouts/AuthLayout.tsx
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="min-w-full  rounded-lg shadow-">
                {children}
            </div>
        </div>
    );
}
