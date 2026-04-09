"use client";

import { useState } from "react";
import { createConsole } from "../app/actions/consoleActions";
import Link from "next/link";

export default function NewConsole() {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6 text-white overflow-hidden">

      {/* FONDO */}
      <div className="absolute inset-0 bg-[url('/imgs/bg_game.png')] bg-cover bg-center scale-110"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/80 to-black backdrop-blur-xl"></div>

      {/* LUCES */}
      <div className="absolute w-[400px] h-[400px] bg-cyan-500/20 blur-[120px] top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-pink-500/20 blur-[120px] bottom-[-100px] right-[-100px]"></div>

      {/* FORM */}
      <form
        action={createConsole}
        className="relative z-10 w-full max-w-3xl bg-black/60 backdrop-blur-2xl border border-cyan-500/20 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,255,255,0.15)] flex flex-col gap-6"
      >

        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-3xl font-black uppercase tracking-widest bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            Nueva Consola
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Crea una nueva consola en tu colección
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input name="name" placeholder="Nombre" required className="input-gamer" />
          <input name="manufacturer" placeholder="Fabricante" required className="input-gamer" />

          <input type="date" name="releaseDate" required className="input-gamer col-span-2" />

          {/* IMAGEN */}
          <div className="col-span-2">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImage}
              className="input-gamer w-full"
            />

            {/* PREVIEW */}
            {preview && (
              <div className="mt-4 rounded-xl overflow-hidden border border-cyan-400/30 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
                <img src={preview} className="w-full h-48 object-cover hover:scale-105 transition duration-500" />
              </div>
            )}
          </div>

          <textarea name="description" placeholder="Descripción" className="input-gamer col-span-2 min-h-[100px]" />

        </div>

        {/* BOTONES */}
        <div className="flex gap-4 mt-4">

          <Link
            href="/consoles"
            className="flex-1 text-center py-3 rounded-xl border border-white/20 hover:bg-white/10 transition uppercase text-sm hover:scale-105"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-cyan-400 hover:scale-105 transition shadow-[0_0_20px_rgba(34,197,94,0.4)] uppercase tracking-wider"
          >
            Guardar Consola
          </button>

        </div>

      </form>
    </div>
  );
}