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

      {/* 🎮 FONDO */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/imgs/bg_game.png')] bg-cover bg-center opacity-40 scale-110"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      </div>

      {/* ✨ LUCES */}
      <div className="absolute w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-cyan-500/20 blur-[100px] md:blur-[150px] top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-purple-500/20 blur-[100px] md:blur-[150px] bottom-[-100px] right-[-100px]"></div>

      {/* 🎮 FORMULARIO */}
      <form
        action={createGame}
        className="relative z-10 w-full max-w-3xl p-[2px] rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 animate-border"
      >
        <div className="bg-gray-950/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 space-y-6 border border-white/10">

          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Nuevo Juego
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[10px] text-cyan-400 ml-2 mb-1 font-bold uppercase">Título</label>
              <input name="title" placeholder="Título" required className="input-gamer" />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] text-cyan-400 ml-2 mb-1 font-bold uppercase">Desarrollador</label>
              <input name="developer" placeholder="Desarrollador" required className="input-gamer" />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] text-cyan-400 ml-2 mb-1 font-bold uppercase">Fecha de Lanzamiento</label>
              {/* Se añadió min-h para que el input de fecha no se colapse en móvil */}
              <input type="date" name="releaseDate" required className="input-gamer min-h-[50px]" />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] text-cyan-400 ml-2 mb-1 font-bold uppercase">Precio</label>
              <input name="price" type="number" step="0.01" placeholder="Precio" required className="input-gamer" />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] text-cyan-400 ml-2 mb-1 font-bold uppercase">Género</label>
              <input name="genre" placeholder="Género" required className="input-gamer" />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] text-cyan-400 ml-2 mb-1 font-bold uppercase">Consola</label>
              <select name="console_id" required className="input-gamer appearance-none">
                <option value="" className="bg-gray-900">Selecciona consola</option>
                {consoles?.map((c: any) => (
                  <option key={c.id} value={c.id} className="bg-gray-900">{c.name}</option>
                ))}
              </select>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-4">
              <label className="text-[10px] text-purple-400 ml-2 mb-1 font-bold uppercase block text-center">Portada</label>
              <input type="file" name="cover" accept="image/*" onChange={handleImage} className="input-gamer w-full" />
              {preview && (
                <div className="mt-2 rounded-xl overflow-hidden border border-cyan-400/30 shadow-[0_0_20px_rgba(0,255,255,0.4)]">
                  <img src={preview} className="w-full h-48 md:h-64 object-cover" alt="Preview" />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Link href="/games" className="btn-gamer bg-gradient-to-r from-red-500 to-pink-600 text-center order-2 sm:order-1">
              Cancelar
            </Link>
            <button type="submit" className="btn-gamer bg-gradient-to-r from-cyan-400 to-blue-600 order-1 sm:order-2">
              Guardar Juego
            </button>
          </div>
        </div>
      </form>

      <style>{`
        .input-gamer {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          background: rgba(10, 10, 20, 0.9);
          border: 1px solid rgba(0, 255, 255, 0.2);
          color: white;
          transition: 0.3s;
          /* CRÍTICO: font-size 16px para evitar el zoom automático en celulares */
          font-size: 16px;
        }

        @media (min-width: 768px) {
          .input-gamer {
            font-size: 14px; /* En PC si puede ser más pequeña */
          }
        }

        .input-gamer:focus {
          outline: none;
          border-color: #00ffff;
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
        }

        /* Estilo específico para que el input de fecha sea legible en móvil */
        input[type="date"] {
          display: flex;
          align-items: center;
          text-transform: uppercase;
        }

        .btn-gamer {
          padding: 14px;
          border-radius: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: 0.3s;
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
          font-size: 14px;
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
          padding: 5px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}