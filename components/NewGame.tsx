"use client";

import { useState } from "react";
import { createGame } from "../app/actions/gameActions";
import Link from "next/link";
import imageCompression from 'browser-image-compression';

export default function NewGame({ consoles }: any) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImage = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    try {
      const options = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1280,
        useWebWorker: true
      };

      const compressedFile = await imageCompression(file, options);
      
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(new File([compressedFile], file.name, { type: file.type }));
      
      const fileInput = document.querySelector('input[name="cover"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.files = dataTransfer.files;
      }

      setPreview(URL.createObjectURL(compressedFile));
      console.log("Cover optimized for cloud storage");

    } catch (error) {
      console.error("Error processing cover image:", error);
    }
  };

  const handleSubmit = () => {
    setIsUploading(true);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative p-4 md:p-6 text-white overflow-x-hidden">

      {/* 🎮 BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/imgs/bg_game.png')] bg-cover bg-center opacity-40 scale-110"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      </div>

      {/* ✨ LIGHTS */}
      <div className="absolute w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-cyan-500/20 blur-[100px] md:blur-[150px] top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-purple-500/20 blur-[100px] md:blur-[150px] bottom-[-100px] right-[-100px]"></div>

      {/* 🎮 FORM */}
      <form
        action={createGame}
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-3xl p-[2px] rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 animate-border"
      >
        <div className="bg-gray-950/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 space-y-6 border border-white/10">

          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent italic">
              New Game
            </h2>
            <p className="text-gray-500 text-[10px] tracking-[0.4em] uppercase font-bold mt-2">Database // Entry Mode</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[10px] text-cyan-400 ml-2 mb-1 font-bold uppercase tracking-widest">Title</label>
              <input name="title" placeholder="Game Title" required className="input-gamer" />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] text-cyan-400 ml-2 mb-1 font-bold uppercase tracking-widest">Developer</label>
              <input name="developer" placeholder="Studio Name" required className="input-gamer" />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] text-cyan-400 ml-2 mb-1 font-bold uppercase tracking-widest">Release Date</label>
              <input type="date" name="releaseDate" required className="input-gamer min-h-[50px]" />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] text-cyan-400 ml-2 mb-1 font-bold uppercase tracking-widest">Price</label>
              <input name="price" type="number" step="0.01" placeholder="0.00" required className="input-gamer" />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] text-cyan-400 ml-2 mb-1 font-bold uppercase tracking-widest">Genre</label>
              <input name="genre" placeholder="Action, RPG, etc." required className="input-gamer" />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] text-cyan-400 ml-2 mb-1 font-bold uppercase tracking-widest">Console</label>
              <select name="console_id" required className="input-gamer appearance-none">
                <option value="" className="bg-gray-900 text-gray-500 italic">Select a console...</option>
                {consoles?.map((c: any) => (
                  <option key={c.id} value={c.id} className="bg-gray-950">{c.name}</option>
                ))}
              </select>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-4">
              <label className="text-[10px] text-purple-400 ml-2 mb-1 font-bold uppercase block text-center tracking-[0.2em]">Game Cover</label>
              <input type="file" name="cover" accept="image/*" onChange={handleImage} className="input-gamer w-full" />
              {preview && (
                <div className="mt-2 rounded-xl overflow-hidden border border-cyan-400/30 shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all animate-in fade-in zoom-in duration-300">
                  <img src={preview} className="w-full h-48 md:h-64 object-cover" alt="Preview" />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <Link href="/games" className="btn-gamer bg-gradient-to-r from-red-500 to-pink-600 text-center order-2 sm:order-1 opacity-80 hover:opacity-100 flex items-center justify-center">
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={isUploading}
              className={`btn-gamer bg-gradient-to-r from-cyan-400 to-blue-600 order-1 sm:order-2 ${isUploading ? 'opacity-50 grayscale' : 'hover:scale-[1.02]'}`}
            >
              {isUploading ? "PROCESSING..." : "Save Game"}
            </button>
          </div>
        </div>
      </form>

      <style>{`
        .input-gamer {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          background: rgba(10, 10, 20, 0.95);
          border: 1px solid rgba(0, 255, 255, 0.15);
          color: white;
          transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 16px;
        }

        @media (min-width: 768px) {
          .input-gamer { font-size: 14px; }
        }

        .input-gamer:focus {
          outline: none;
          border-color: #00ffff;
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
          background: rgba(15, 15, 30, 1);
        }

        .btn-gamer {
          padding: 14px;
          border-radius: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: 0.3s ease;
          font-size: 13px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.4);
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

        ::selection {
          background: #00ffff;
          color: #000;
        }
      `}</style>
    </div>
  );
}