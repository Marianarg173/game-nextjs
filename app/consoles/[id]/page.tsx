import { PrismaClient } from "@/src/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import Link from "next/link";
import { notFound } from "next/navigation";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

export default async function ConsoleDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const consoleId = Number(id);

  if (isNaN(consoleId)) {
    return notFound();
  }

  const p = prisma as any;
  const consoleModel = p.consoles || p.console;

  const console = await consoleModel.findUnique({
    where: { id: consoleId },
    include: { games: true },
  });

  if (!console) {
    return notFound();
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 text-white overflow-hidden">

      {/* FONDO */}
      <div className="absolute inset-0 bg-[url('/imgs/bg_game.png')] bg-cover bg-center scale-110"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/80 to-black backdrop-blur-xl"></div>

      {/* GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-[120px] top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-pink-500/20 blur-[120px] bottom-[-100px] right-[-100px]"></div>

      {/* CONTENIDO */}
      <div className="relative z-10 w-full max-w-4xl bg-black/60 border border-cyan-500/20 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,255,255,0.15)] flex flex-col md:flex-row backdrop-blur-2xl">

        {/* IMAGEN */}
        <div className="w-full md:w-1/2 h-80 md:h-auto relative group">
          <img
            src={`/imgs/${console.image}`}
            alt={console.name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:hidden"></div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-cyan-500/10 transition"></div>
        </div>

        {/* INFO */}
        <div className="p-8 md:w-1/2 flex flex-col">
          <Link
            href="/consoles"
            className="text-cyan-400 hover:text-cyan-300 text-sm font-bold mb-4 flex items-center gap-2 transition"
          >
            ← Volver a la galería
          </Link>

          <h1 className="text-4xl font-black mb-2 uppercase tracking-tight bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            {console.name}
          </h1>

          <div className="flex gap-2 mb-6 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold uppercase shadow-sm">
              {console.manufacturer}
            </span>

            <span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/40 text-green-300 text-xs font-bold shadow-sm">
              {console.games.length} juegos
            </span>
          </div>

          <div className="space-y-4 flex-grow">
            <div>
              <h3 className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                Fecha de lanzamiento
              </h3>
              <p className="text-white font-medium">{new Date(console.releaseDate).toLocaleDateString()}</p>
            </div>

            <div>
              <h3 className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                Descripción
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed italic border-l-2 border-cyan-500 pl-3">
                "{console.description}"
              </p>
            </div>

            <div>
              <h3 className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                Juegos disponibles
              </h3>
              {console.games.length > 0 ? (
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {console.games.map((game: any) => (
                    <Link
                      key={game.id}
                      href={`/games/${game.id}`}
                      className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition"
                    >
                      • {game.title}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No hay juegos registrados para esta consola</p>
              )}
            </div>
          </div>

          {/* BOTÓN */}
          <div className="mt-8 pt-6 border-t border-white/5 flex gap-3">
            <Link
              href={`/consoles/editar/${console.id}`}
              className="
              relative flex-1 text-center py-3 rounded-xl
              font-black uppercase tracking-widest text-black
              bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500
              shadow-[0_0_15px_rgba(34,211,238,0.6)]
              transition-all duration-300
              hover:scale-105 hover:shadow-[0_0_25px_rgba(168,85,247,0.9)]
              before:absolute before:inset-0 before:rounded-xl
              before:bg-gradient-to-r before:from-cyan-400 before:via-purple-500 before:to-pink-500
              before:opacity-0 hover:before:opacity-20
              before:blur-md before:transition
              "
            >
              EDITAR CONSOLA
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}