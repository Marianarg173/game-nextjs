"use client";

import Link from "next/link";
import Image from "next/image";
import { SignIn as SignIcon, UserPlus as UserPlusIcon } from "@phosphor-icons/react";

export default function HomeInfo() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden p-6">
      {/* Fondo con Overlay Gradiente */}
      <div 
        className="absolute inset-0 bg-[url('/imgs/bg-home.jpeg')] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "linear-gradient(to bottom, rgba(11, 15, 26, 0.6), rgba(11, 15, 26, 0.95)), url('/imgs/bg-home.jpeg')" }}
      />

      {/* Contenedor Principal (Más estrecho para PC y móvil) */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        
        {/* Logo Reducido */}
        <div className="mb-6 transform hover:scale-105 transition-transform duration-500 w-40 md:w-56">
          <Image
            src="/imgs/logo.png"
            alt="GameNext.js"
            width={300}
            height={150}
            className="drop-shadow-[0_0_8px_rgba(34,211,238,0.3)] object-contain"
            priority
          />
        </div>

        {/* Tarjeta Glassmorphism Compacta */}
        <div className="bg-black/20 backdrop-blur-lg border border-white/10 p-6 md:p-7 rounded-2xl shadow-2xl text-center w-full">
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-6 px-1">
            <span className="text-cyan-400 font-bold">GameNext.js</span> is a modern platform to manage and organize 
            videogames. Built with <span className="text-white font-medium">Next.js</span> and Stack Auth for secure management.
          </p>

          {/* Botones Estilizados y más pequeños */}
          <div className="flex flex-col gap-3">
            <Link 
              href="/handler/sign-in" 
              className="group flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2.5 rounded-xl transition-all shadow-md active:scale-95 text-[13px] uppercase tracking-wider"
            >
              <SignIcon size={18} weight="bold" />
              <span>Sign In</span>
            </Link>

            <Link 
              href="/handler/sign-up" 
              className="group flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-2.5 rounded-xl transition-all active:scale-95 text-[13px] uppercase tracking-wider"
            >
              <UserPlusIcon size={18} weight="bold" />
              <span>Sign Up</span>
            </Link>
          </div>
        </div>

        {/* Decoración Inferior Sutil */}
        <div className="mt-8 flex items-center gap-2 text-white/20 text-[9px] font-mono uppercase tracking-[0.5em]">
          <span className="h-[1px] w-4 bg-white/10"></span>
          Level Up
          <span className="h-[1px] w-4 bg-white/10"></span>
        </div>
      </div>
    </div>
  );
}