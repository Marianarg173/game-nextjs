"use client";

import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";

export default function BackHomebutton() {
  return (
    <Link
      href="/dashboard"
      // w-14 h-14 y rounded-full lo hacen un círculo perfecto para que solo quepa la flecha
      className="flex items-center justify-center w-14 h-14 rounded-full bg-white/5 border border-white/10 text-cyan-400 hover:bg-cyan-400 hover:text-black hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]"
    >
      <ArrowLeft size={28} weight="bold" />
    </Link>
  );
}