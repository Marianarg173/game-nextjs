"use client";

import { StackProvider, StackTheme, useStackApp } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideBar from "@/components/SideBarContent";
import HeaderUser from "@/components/HeaderUser";
import MobileMenu from "@/components/MobileMenu";
import { Suspense } from "react";
import { Gamepad2 } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

function AuthProtectedLayout({ children }: { children: React.ReactNode }) {
  const stack = useStackApp();
  const user = stack.useUser();

  if (user === null) {
    return (
      <main className="min-h-screen w-full flex flex-col bg-[#0b0f1a]">
        {children}
      </main>
    );
  }

  return (

    <div className="flex min-h-screen w-full flex-col">


      <header className="sticky top-0 h-16 flex-shrink-0 flex items-center justify-between px-4 md:px-8 border-b border-white/5 bg-[#111625]/95 backdrop-blur-md z-[100]">
        <div className="flex items-center gap-3 text-white">
          <MobileMenu />
          <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Gamepad2 className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-black tracking-tighter uppercase">GamesNextJS</span>
        </div>

        <Suspense fallback={<div className="h-8 w-8 rounded-full bg-white/5 animate-pulse" />}>
          {user && <HeaderUser />}
        </Suspense>
      </header>

      <div className="flex flex-1 relative">

        <aside className="hidden md:block sticky top-16 h-[calc(100vh-64px)] flex-shrink-0 border-r border-white/5 bg-[#111625]">
          <Suspense fallback={<div className="w-48 h-full bg-[#111625] animate-pulse" />}>
            <SideBar />
          </Suspense>
        </aside>

        <main className="flex-1 p-4 md:p-8 bg-[#0b0f1a]">
          {user === undefined ? (
            <div className="flex items-center justify-center h-[50vh]">
              <div className="text-gray-400 animate-pulse">Cargando...</div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b0f1a] text-white`}>
        <StackProvider app={stackClientApp}>
          <StackTheme>
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