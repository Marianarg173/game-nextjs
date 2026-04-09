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
    return <div className="text-white flex items-center justify-center min-h-screen">Juego no encontrado</div>;
  }

  const consoles = await consolesModel.findMany();

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6 text-white overflow-hidden">
      
      {/* 🎮 FONDO GAMER PRO */}
      <div className="absolute inset-0 bg-[url('/imgs/bg_game.png')] bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>

      {/* ✨ EFECTO NEÓN */}
      <div className="absolute w-[600px] h-[600px] bg-cyan-500/20 blur-[150px] top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-[150px] bottom-[-100px] right-[-100px]"></div>

      {/* 🎮 CARD PRINCIPAL */}
      <form
        action={async (formData) => {
          "use server";
          await updateGame(game.id, formData);
        }}
        className="relative z-10 w-full max-w-3xl p-[2px] rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 animate-border"
      >
        <div className="bg-gray-950/90 backdrop-blur-xl rounded-3xl p-8 space-y-6 border border-white/10">
          
          {/* HEADER */}
          <h2 className="text-4xl font-black text-center uppercase tracking-widest bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Editar Juego
          </h2>

          {/* GRID */}
          <div className="grid grid-cols-2 gap-5">
            <input name="title" defaultValue={game.title} placeholder="Título" className="input-gamer" />
            <input name="developer" defaultValue={game.developer} placeholder="Desarrollador" className="input-gamer" />

            <input
              type="date"
              name="releasedate"
              defaultValue={game.releasedate ? new Date(game.releasedate).toISOString().split("T")[0] : ""}
              className="input-gamer"
            />

            <input name="price" type="number" step="0.01" defaultValue={game.price} placeholder="Precio" className="input-gamer" />

            <input name="genre" defaultValue={game.genre} placeholder="Género" className="input-gamer" />

            <select name="console_id" defaultValue={game.console_id} className="input-gamer">
              {consoles.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* IMAGEN */}
          <div className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-cyan-500/20">
            <img
              src={`/imgs/${game.cover}`}
              alt={game.title}
              className="w-24 h-24 object-cover rounded-xl border border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.5)]"
            />
            <div>
              <p className="text-xs text-gray-400 mb-1">Cambiar portada:</p>
              <input type="file" name="cover" accept="image/*" className="text-xs" />
            </div>
          </div>

          {/* DESCRIPCIÓN */}
          <textarea
            name="description"
            defaultValue={game.description}
            placeholder="Descripción"
            className="input-gamer min-h-[100px]"
          />

          {/* BOTONES PRO 🔥 */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            
            {/* GUARDAR */}
            <button
              type="submit"
              className="btn-gamer bg-gradient-to-r from-cyan-400 to-blue-600"
            >
              Guardar
            </button>

            {/* CANCELAR */}
            <Link
              href="/games"
              className="btn-gamer bg-gradient-to-r from-red-500 to-pink-600 text-center"
            >
              Cancelar
            </Link>
          </div>
        </div>
      </form>

      {/* 🎨 ESTILOS GAMER */}
      <style>
        {`
          .input-gamer {
            width: 100%;
            padding: 12px;
            border-radius: 12px;
            background: rgba(10, 10, 20, 0.9);
            border: 1px solid rgba(0,255,255,0.2);
            color: white;
            transition: 0.3s;
          }

          .input-gamer:focus {
            outline: none;
            border-color: #00ffff;
            box-shadow: 0 0 15px #00ffff;
          }

          .btn-gamer {
            padding: 14px;
            border-radius: 12px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: 0.3s;
            box-shadow: 0 0 20px rgba(0,255,255,0.3);
          }

          .btn-gamer:hover {
            transform: scale(1.05);
            box-shadow: 0 0 30px rgba(0,255,255,0.8);
          }

          .animate-border {
            background-size: 300% 300%;
            animation: borderMove 4s linear infinite;
          }

          @keyframes borderMove {
            0% { background-position: 0% }
            100% { background-position: 300% }
          }
        `}
      </style>
    </div>
  );
}