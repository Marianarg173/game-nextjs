import { PrismaClient } from "@/src/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { updateGame } from "@/app/actions/gameActions";
import Link from "next/link";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

export default async function EditGame({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gameId = Number(id);

  if (!gameId) {
    return <div className="text-white flex items-center justify-center min-h-screen">ID inválido</div>;
  }

  const p = prisma as any;
  const gamesModel = p.games || p.game;
  const consolesModel = p.consoles || p.console;

  const game = await gamesModel.findUnique({
    where: { id: gameId },
  });

  if (!game) {
    return <div className="text-white flex items-center justify-center min-h-screen font-black italic">GAME NOT FOUND // 404</div>;
  }

  const consoles = await consolesModel.findMany();

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative p-4 md:p-10 text-white overflow-x-hidden">
      
      {/* 🎮 FONDO DINÁMICO */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/imgs/bg_game.png')] bg-cover bg-center opacity-40 grayscale"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black"></div>
      </div>

      {/* ✨ LUCES DE NEÓN RESPONSIVAS */}
      <div className="absolute w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-cyan-500/10 blur-[80px] md:blur-[150px] top-[-50px] left-[-50px]"></div>
      <div className="absolute w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-purple-500/10 blur-[80px] md:blur-[150px] bottom-[-50px] right-[-50px]"></div>

      {/* 🎮 FORMULARIO ADAPTADO */}
      <form
        action={async (formData) => {
          "use server";
          await updateGame(game.id, formData);
        }}
        className="relative z-10 w-full max-w-2xl p-[1px] md:p-[2px] rounded-2xl md:rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 animate-border"
      >
        <div className="bg-gray-950/95 backdrop-blur-2xl rounded-2xl md:rounded-3xl p-5 md:p-8 space-y-5 border border-white/5">
          
          {/* HEADER AJUSTADO */}
          <h2 className="text-2xl md:text-4xl font-black text-center uppercase tracking-tighter md:tracking-widest bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent italic">
            Editar Juego
          </h2>

          {/* GRID INTELIGENTE (1 columna en cel, 2 en PC) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
               <label className="text-[10px] uppercase font-bold text-cyan-500 ml-2">Título</label>
               <input name="title" defaultValue={game.title} placeholder="Título" className="input-gamer" />
            </div>
            
            <div className="flex flex-col gap-1">
               <label className="text-[10px] uppercase font-bold text-cyan-500 ml-2">Desarrollador</label>
               <input name="developer" defaultValue={game.developer} placeholder="Desarrollador" className="input-gamer" />
            </div>

            <div className="flex flex-col gap-1">
               <label className="text-[10px] uppercase font-bold text-cyan-500 ml-2">Lanzamiento</label>
               <input
                 type="date"
                 name="releasedate"
                 defaultValue={game.releasedate ? new Date(game.releasedate).toISOString().split("T")[0] : ""}
                 className="input-gamer"
               />
            </div>

            <div className="flex flex-col gap-1">
               <label className="text-[10px] uppercase font-bold text-cyan-500 ml-2">Precio ($)</label>
               <input name="price" type="number" step="0.01" defaultValue={game.price} placeholder="Precio" className="input-gamer" />
            </div>

            <div className="flex flex-col gap-1">
               <label className="text-[10px] uppercase font-bold text-cyan-500 ml-2">Género</label>
               <input name="genre" defaultValue={game.genre} placeholder="Género" className="input-gamer" />
            </div>

            <div className="flex flex-col gap-1">
               <label className="text-[10px] uppercase font-bold text-cyan-500 ml-2">Plataforma</label>
               <select name="console_id" defaultValue={game.console_id} className="input-gamer">
                 {consoles.map((c: any) => (
                   <option key={c.id} value={c.id} className="bg-gray-900 text-white">{c.name}</option>
                 ))}
               </select>
            </div>
          </div>

          {/* SECCIÓN IMAGEN RESPONSIVA */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-zinc-900/50 rounded-xl border border-white/5">
            <img
              src={`/imgs/${game.cover}`}
              alt={game.title}
              className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border-2 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            />
            <div className="w-full text-center sm:text-left">
              <p className="text-[10px] text-zinc-500 uppercase font-bold mb-2">Cambiar Cover Art</p>
              <input type="file" name="cover" accept="image/*" className="text-xs w-full block file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-cyan-500 file:text-black hover:file:bg-cyan-400 cursor-pointer" />
            </div>
          </div>

          {/* DESCRIPCIÓN */}
          <textarea
            name="description"
            defaultValue={game.description}
            placeholder="Descripción del juego..."
            className="input-gamer min-h-[120px] text-sm"
          />

          {/* BOTONES STACKED EN CELULAR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="submit"
              className="btn-gamer bg-gradient-to-r from-cyan-500 to-blue-600 order-1 sm:order-1"
            >
              Confirmar
            </button>

            <Link
              href="/games"
              className="btn-gamer bg-zinc-800 hover:bg-zinc-700 text-center order-2 sm:order-2 text-sm md:text-base border border-white/10"
            >
              Cancelar
            </Link>
          </div>
        </div>
      </form>

      {/* 🎨 ESTILOS CSS REVISADOS */}
      <style>
        {`
          .input-gamer {
            width: 100%;
            padding: 10px 14px;
            border-radius: 10px;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 0.875rem;
            transition: all 0.2s;
          }

          .input-gamer:focus {
            outline: none;
            border-color: #06b6d4;
            background: rgba(6, 182, 212, 0.05);
            box-shadow: 0 0 10px rgba(6, 182, 212, 0.2);
          }

          .btn-gamer {
            padding: 12px;
            border-radius: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .btn-gamer:active {
            transform: scale(0.95);
          }

          @media (min-width: 768px) {
            .btn-gamer:hover {
              transform: scale(1.02);
              filter: brightness(1.1);
            }
          }

          .animate-border {
            background-size: 200% 200%;
            animation: borderMove 3s linear infinite;
          }

          @keyframes borderMove {
            0% { background-position: 0% 50% }
            50% { background-position: 100% 50% }
            100% { background-position: 0% 50% }
          }
        `}
      </style>
    </div>
  );
}