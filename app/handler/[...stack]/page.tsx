"use client";

import { StackHandler } from "@stackframe/stack";
import BackHomebutton from "@/components/BackHome";
import { usePathname } from "next/navigation";

export default function Handler() {
  const pathname = usePathname();

  const isSettings =
    pathname.includes("account-settings") ||
    pathname.includes("user-profile");

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-3 relative overflow-hidden">
      
      {/* Luces suaves */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-cyan-500/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-fuchsia-500/10 blur-[100px] rounded-full" />

      {/* Header settings */}
      {isSettings && (
        <div className="relative z-20 mb-5 text-center">
          <span className="text-cyan-400 text-[9px] font-black uppercase tracking-[0.35em] border border-cyan-400/30 px-2.5 py-1 rounded-full bg-cyan-400/5">
            System Panel
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white mt-3">
            Ajustes{" "}
            <span className="text-cyan-400">
              de Perfil
            </span>
          </h2>
        </div>
      )}

      {/* Card principal */}
      <main
        className={`relative z-10 w-full transition-all duration-500 ease-in-out
        ${isSettings ? "max-w-5xl" : "max-w-[360px]"}
        bg-slate-900/55 backdrop-blur-xl border border-white/10
        p-3 md:p-4 rounded-[1.4rem] shadow-2xl`}
      >
        <div className="stack-custom-container">
          <style
            dangerouslySetInnerHTML={{
              __html: `
                .stack-custom-container [class*="stack-header"], 
                .stack-custom-container h2:first-of-type { 
                  display: none !important; 
                }

                .stack-custom-container * {
                  color: #f8fafc !important;
                }

                .stack-custom-container label {
                  color: #22d3ee !important;
                  font-size: 10px !important;
                  font-weight: 700 !important;
                }

                /* 🔘 BOTONES MÁS PEQUEÑOS */
                .stack-custom-container button {
                  background: #22d3ee !important;
                  color: #020617 !important;
                  font-weight: 800 !important;
                  text-transform: uppercase !important;
                  letter-spacing: 0.4px !important;
                  border-radius: 10px !important;
                  padding: 6px 10px !important;
                  min-height: 34px !important;
                  font-size: 12px !important;
                }

                /* ✍️ INPUTS MÁS FINOS */
                .stack-custom-container input {
                  background: rgba(15, 23, 42, 0.65) !important;
                  border: 1px solid rgba(255,255,255,0.08) !important;
                  border-radius: 10px !important;
                  min-height: 34px !important;
                  font-size: 12px !important;
                  padding: 0 10px !important;
                }

                [data-stack-content] {
                  width: 100% !important;
                  max-width: 100% !important;
                }
              `,
            }}
          />

          <StackHandler fullPage={false} />
        </div>

        <div className="mt-5 pt-4 border-t border-white/5 flex justify-center">
          <BackHomebutton />
        </div>
      </main>

      <div className="absolute left-8 bottom-8 hidden lg:block opacity-20 rotate-90 text-white font-mono text-[9px] tracking-[0.7em] uppercase">
        GameNext.js // UI
      </div>
    </div>
  );
}