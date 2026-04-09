"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
// Agregamos Desktop a la importación para eliminar el error rojo
import { List, X, House, GameController, Gear, Desktop } from "@phosphor-icons/react";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: <House size={28} /> },
    { name: "Games", href: "/games", icon: <GameController size={28} /> },
    { name: "Consoles", href: "/consoles", icon: <Desktop size={28} /> },
    { name: "Settings", href: "/handler/account-settings", icon: <Gear size={28} /> },
  ];

  return (
    <div className="md:hidden">
      <button onClick={() => setIsOpen(true)} className="p-2 text-cyan-400 relative z-[50]">
        <List size={32} weight="bold" />
      </button>

      {isOpen && (
        /* Cambiamos fixed inset-0 y z-[9999] con fondo sólido para que NADA se traspase */
        <div className="fixed inset-0 z-[9999] bg-[#0b0f1a] flex flex-col p-8">
          
          <div className="flex justify-between items-center mb-12">
            <span className="text-2xl font-black text-white italic">
              GAME<span className="text-cyan-400">NEXTJS</span>
            </span>
            <button onClick={() => setIsOpen(false)} className="text-fuchsia-500 p-2">
              <X size={36} weight="bold" />
            </button>
          </div>

          <nav className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-5 p-6 rounded-2xl bg-[#1a1f2e] border border-white/10 text-white text-xl font-bold shadow-2xl"
              >
                <span className="text-cyan-400">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pb-8 text-center opacity-5">
            <p className="text-7xl font-black text-white italic">GN-JS</p>
          </div>
        </div>
      )}
    </div>
  );
}