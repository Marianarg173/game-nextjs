// app/layout.tsx
"use client";

import { StackProvider, StackTheme, useStackApp } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideBar from "@/components/SideBarContent";
import HeaderUser from "@/components/HeaderUser";
import MobileMenu from "@/components/MobileMenu";
import { Suspense } from "react";

const geistSans = Geist({ 
  variable: "--font-geist-sans", 
  subsets: ["latin"] 
});

const geistMono = Geist_Mono({ 
  variable: "--font-geist-mono", 
  subsets: ["latin"] 
});

// 1. Esta es la parte que causaba el error. 
// La separamos para poder envolverla en Suspense abajo.
function AuthProtectedLayout({ children }: { children: React.ReactNode }) {
  const stack = useStackApp();
  const user = stack.useUser(); // Aquí es donde ocurría el NoSuspenseBoundaryError

  if (!user) {
    return (
      <main className="min-h-screen w-full flex flex-col">
        {children}
      </main>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <header className="h-16 flex-shrink-0 flex items-center justify-between px-4 md:px-8 border-b border-white/5 bg-[#111625]/80 backdrop-blur-md relative z-[100]">
        <div className="flex items-center gap-3 text-white">
          <MobileMenu />
          <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M12 2.5C6.7 2.5 2.5 6.7 2.5 12S6.7 21.5 12 21.5 21.5 17.3 21.5 12 17.3 2.5 12 2.5Zm0 1.5c4.4 0 7.9 3.5 7.9 7.9S16.4 19.8 12 19.8 4.1 16.3 4.1 12 7.6 4 12 4Zm-2.2 4.2h4.4a1 1 0 010 2H9.8a1 1 0 010-2Zm-2 4.6h8.4a1 1 0 010 2H7.8a1 1 0 010-2Zm-1.8 4.6h11.6a1 1 0 010 2H6a1 1 0 010-2Z" />
            </svg>
          </div>
          <span className="text-lg font-black tracking-tighter uppercase">GameNextJS</span>
        </div>

        <Suspense fallback={<div className="h-8 w-8 rounded-full bg-white/5 animate-pulse" />}>
          <HeaderUser />
        </Suspense>
      </header>

      <div className="flex flex-1 min-h-0 relative">
        <aside className="hidden md:block flex-shrink-0 border-r border-white/5 bg-[#111625]">
          <Suspense fallback={<div className="w-48 h-full bg-[#111625] animate-pulse" />}>
            <SideBar />
          </Suspense>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0b0f1a]">
          {children}
        </main>
      </div>
    </div>
  );
}

// 2. El RootLayout principal
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b0f1a] text-white`}>
        <StackProvider app={stackClientApp}>
          <StackTheme>
            {/* 3. ¡SOLUCIÓN! Envolvemos el componente que usa useUser en un Suspense global */}
            <Suspense fallback={<div className="min-h-screen w-full bg-[#0b0f1a] animate-pulse" />}>
              <AuthProtectedLayout>
                {children}
              </AuthProtectedLayout>
            </Suspense>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}