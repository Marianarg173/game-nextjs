"use client";

import { useState } from "react";
import { createConsole } from "../app/actions/consoleActions";
import Link from "next/link";
import imageCompression from 'browser-image-compression'; // 1. Importamos la librería

export default function NewConsole() {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false); // Estado para el botón

  const handleImage = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    // Mostrar preview rápido (opcional, pero ayuda a la experiencia)
    setPreview(URL.createObjectURL(file));

    try {
      // 2. Configuración de compresión para que Vercel no lo rebote
      const options = {
        maxSizeMB: 0.8,          // Menos de 1MB para estar seguros
        maxWidthOrHeight: 1280, // Calidad HD suficiente para web
        useWebWorker: true
      };

      const compressedFile = await imageCompression(file, options);
      
      // Creamos un nuevo DataTransfer para reemplazar el archivo en el input
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(new File([compressedFile], file.name, { type: file.type }));
      
      // Reemplazamos el archivo original por el comprimido en el input real
      const fileInput = document.querySelector('input[name="image"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.files = dataTransfer.files;
      }

      // Actualizar preview con la imagen comprimida
      setPreview(URL.createObjectURL(compressedFile));
      console.log("Imagen comprimida con éxito");

    } catch (error) {
      console.error("Error comprimiendo imagen:", error);
    }
  };

  // Función para manejar el envío y activar el "Subiendo..."
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsUploading(true);
    // El formulario seguirá su curso normal hacia el action createConsole
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative p-4 md:p-6 text-white overflow-x-hidden">

      {/* 🎮 FONDO */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/imgs/bg_game.png')] bg-cover bg-center opacity-40 scale-110"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      </div>

      {/* ✨ LUCES NEÓN */}
      <div className="absolute w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-cyan-500/20 blur-[100px] md:blur-[150px] top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-purple-500/20 blur-[100px] md:blur-[150px] bottom-[-100px] right-[-100px]"></div>

      {/* 🎮 FORMULARIO */}
      <form
        action={createConsole}
        onSubmit={handleSubmit} // Agregamos el disparador del botón
        className="relative z-10 w-full max-w-2xl p-[2px] rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 animate-border"
      >
        <div className="bg-gray-950/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 space-y-6 border border-white/10">

          {/* HEADER */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent italic">
              Nueva Consola
            </h2>
            <p className="text-gray-400 text-[10px] md:text-xs mt-2 uppercase tracking-[0.3em] font-bold opacity-70">
              System Registration // Hardware Entry
            </p>
          </div>

          {/* GRID RESPONSIVO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-cyan-400 ml-2 tracking-widest">Nombre</label>
              <input name="name" placeholder="E.g. PlayStation 5" required className="input-gamer" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-cyan-400 ml-2 tracking-widest">Fabricante</label>
              <input name="manufacturer" placeholder="E.g. Sony" required className="input-gamer" />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] uppercase font-bold text-cyan-400 ml-2 tracking-widest">Fecha de Lanzamiento</label>
              <input type="date" name="releaseDate" required className="input-gamer min-h-[50px]" />
            </div>

            <div className="col-span-1 md:col-span-2 space-y-3 pt-2">
              <label className="text-[10px] uppercase font-bold text-purple-400 ml-2 tracking-widest text-center block">Imagen de Hardware</label>
              
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImage}
                className="input-gamer w-full cursor-pointer text-xs"
              />

              {preview && (
                <div className="mt-2 rounded-xl overflow-hidden border border-cyan-400/30 shadow-[0_0_20px_rgba(0,255,255,0.4)]">
                  <img src={preview} className="w-full h-48 md:h-64 object-cover" alt="Preview" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] uppercase font-bold text-cyan-400 ml-2 tracking-widest">Descripción</label>
              <textarea name="description" placeholder="Specs o historia..." className="input-gamer min-h-[100px]" />
            </div>
          </div>

          {/* BOTONES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <Link
              href="/consoles"
              className="btn-gamer bg-gradient-to-r from-red-500 to-pink-600 text-center order-2 sm:order-1"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={isUploading}
              className={`btn-gamer bg-gradient-to-r from-cyan-400 to-blue-600 order-1 sm:order-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUploading ? "SUBIENDO..." : "Guardar Consola"}
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
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          transition: all 0.2s ease-in-out;
          font-size: 16px;
        }

        @media (min-width: 768px) {
          .input-gamer { font-size: 14px; }
        }

        .input-gamer:focus {
          outline: none;
          border-color: #00ffff;
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
        }

        .btn-gamer {
          padding: 14px;
          border-radius: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: 0.3s;
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
      `}</style>
    </div>
  );
}