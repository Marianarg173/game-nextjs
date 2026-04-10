"use client";

import { useState } from "react";
import { createGame } from "../app/actions/gameActions";
import Link from "next/link";

export default function NewGame({ consoles }: any) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative p-4 md:p-6 text-white overflow-x-hidden">

      {/* 🎮 FONDO ORIGINAL */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/imgs/bg_game.png')] bg-cover bg-center opacity-40 scale-110"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      </div>

      {/* ✨ TUS LUCES NEÓN (Ajustadas para no estorbar en móvil) */}
      <div className="absolute w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-cyan-500/20 blur-[100px] md:blur-[150px] top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-purple-500/20 blur-[100px] md:blur-[150px] bottom-[-100px] right-[-100px]"></div>

      {/* 🎮 FORMULARIO CON TU BORDE ANIMADO */}
      <form
        action={createGame}
        className="relative z-10 w-full max-w-3xl p-[2px] rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 animate-border"
      >
        <div className="bg-gray-950/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 space-y-6 border border-white/10">

          {/* HEADER CON TUS COLORES */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Nuevo Juego
            </h2>
            <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest opacity-70">
              Añadir a la colección
            </p>
          </div>

          {/* GRID RESPONSIVO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" placeholder="Título" required className="input-gamer" />
            <input name="developer" placeholder="Desarrollador" required className="input-gamer" />
            <input type="date" name="releaseDate" required className="input-gamer" />
            <input name="price" type="number" step="0.01" placeholder="Precio" required className="input-gamer" />
            <input name="genre" placeholder="Género" required className="input-gamer" />

            <select name="console_id" required className="input-gamer appearance-none">
              <option value="" className="bg-gray-900">Selecciona consola</option>
              {consoles?.map((c: any) => (
                <option key={c.id} value={c.id} className="bg-gray-900">{c.name}</option>
              ))}
            </select>

            {/* SECCIÓN DE IMAGEN */}
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="relative group">
                <input
                  type="file"
                  name="cover"
                  accept="image/*"
                  onChange={handleImage}
                  className="input-gamer w-full cursor-pointer"
                />
                <p className="text-[10px] text-cyan-400 mt-2 ml-2 uppercase font-bold">Seleccionar Portada</p>
              </div>

              {/* PREVIEW CON TUS SOMBRAS */}
              {preview && (
                <div className="mt-2 rounded-xl overflow-hidden border border-cyan-400/30 shadow-[0_0_20px_rgba(0,255,255,0.4)]">
                  <img src={preview} className="w-full h-48 md:h-64 object-cover" alt="Preview" />
                </div>
              )}
            </div>
          </div>

          {/* BOTONES CON TUS GRADIENTES ORIGINALES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Link
              href="/games"
              className="btn-gamer bg-gradient-to-r from-red-500 to-pink-600 text-center order-2 sm:order-1"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="btn-gamer bg-gradient-to-r from-cyan-400 to-blue-600 order-1 sm:order-2"
            >
              Guardar Juego
            </button>
          </div>
        </div>
      </form>

      {/* 🎨 TUS ESTILOS CSS REVISADOS */}
      <style>{`
        .input-gamer {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          background: rgba(10, 10, 20, 0.9);
          border: 1px solid rgba(0, 255, 255, 0.2);
          color: white;
          transition: 0.3s;
          font-size: 14px;
        }

        .input-gamer:focus {
          outline: none;
          border-color: #00ffff;
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
        }

        .btn-gamer {
          padding: 14px;
          border-radius: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: 0.3s;
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
          font-size: 13px;
        }

        .btn-gamer:hover {
          transform: scale(1.02);
          box-shadow: 0 0 30px rgba(0, 255, 255, 0.6);
        }

        .btn-gamer:active {
          transform: scale(0.98);
        }

        .animate-border {
          background-size: 300% 300%;
          animation: borderMove 4s linear infinite;
        }

        @keyframes borderMove {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }

        ::-webkit-calendar-picker-indicator {
          filter: invert(1);
        }
      `}</style>
    </div>
  );
}