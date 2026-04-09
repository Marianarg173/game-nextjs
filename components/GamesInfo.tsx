import { PrismaClient } from "@/src/generated/prisma"; 
import { PrismaNeon } from "@prisma/adapter-neon";
import Link from "next/link";
import { deleteGame } from "@/app/actions/gameActions";
import SearchBar from "./SearchBar";

// Mantenemos tu instancia de Prisma tal cual
const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

export const dynamic = "force-dynamic";

export default async function GamesInfo({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  // 1. IMPORTANTE: En Next.js 15 hay que esperar a los params
  const params = await searchParams;
  const searchTerm = params?.search || "";
  const currentPage = Number(params?.page) || 1;
  const pageSize = 8; 

  // ... (tu lógica de Prisma sigue igual) ...
  const p = prisma as any;
  const gamesModel = p.games || p.game;
  const consoleModelName = p.consoles ? "consoles" : "console";

  const where = searchTerm
    ? { title: { contains: searchTerm, mode: "insensitive" as const } }
    : {};

  const [totalGames, games] = await Promise.all([
    gamesModel.count({ where }),
    gamesModel.findMany({
      where,
      include: { [consoleModelName]: true },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      orderBy: { id: "desc" },
    }),
  ]);

  const totalPages = Math.ceil(totalGames / pageSize);
  const hasGames = games.length > 0;

  return (
    /* PASO 1: Quitamos el 'absolute' y el 'relative' del contenedor 
       padre para que no cree un contexto de apilamiento nuevo. 
       Solo lo envolvemos con un simple div.
    */
    <div className="w-full">
      {/* ¡AQUÍ ESTÁ EL CAMBIO IMPORTANTE!
        He eliminado completamente las siguientes líneas que me pasaste antes:
        <div className="absolute inset-0 bg-[url('/imgs/bg_game.png')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
        Y la clase "relative z-10 p-6 text-white" del contenedor inferior.
      */}

      {/* Ahora el contenido es transparente */}
      <div className="p-2 text-white">
        <h1 className="text-4xl font-black mb-8 text-center uppercase tracking-widest text-cyan-400">
          🎮 Video Games 
        </h1>

        <div className="max-w-md mx-auto mb-10">
          <SearchBar />
        </div>

        <div className="mb-8 flex justify-between items-center max-w-7xl mx-auto">
          <p className="text-sm text-gray-400">
            {searchTerm ? `Resultados para "${searchTerm}": ` : "Mostrando "}
            <span className="text-cyan-400 font-bold">{games.length}</span> de {totalGames}
          </p>

          <Link href="/games/crear">
            <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black font-bold hover:scale-110 transition">
              + Nuevo Juego
            </button>
          </Link>
        </div>

        {/* Mantenemos el resto del código igual (la grid de juegos) */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {!hasGames ? (
            <div className="col-span-full text-center py-24 bg-white/5 border border-white/10 rounded-3xl">
              <p className="text-2xl text-gray-400 font-bold">No hay juegos 😢</p>
            </div>
          ) : (
            games.map((game: any) => (
              <div
                key={game.id}
                className="group relative rounded-2xl overflow-hidden bg-black/40 backdrop-blur-xl border border-white/10 transition-all duration-500 hover:scale-[1.05] hover:shadow-[0_0_40px_rgba(0,255,255,0.4)]"
              >
                {/* ... (tu código de tarjeta de juego sigue igual) ... */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
                  <div className="absolute inset-0 rounded-2xl border border-cyan-400 blur-md animate-pulse"></div>
                </div>

                <div className="relative h-56 overflow-hidden">
                  <img
                    src={`/imgs/${game.cover}`}
                    alt={game.title}
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-125 group-hover:rotate-1"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  <div className="absolute top-3 right-3 px-3 py-1 bg-black/70 backdrop-blur-md rounded-lg border border-cyan-400/30">
                    <p className="text-cyan-400 font-bold text-sm">${game.price}</p>
                  </div>
                </div>

                <div className="p-5 flex flex-col">
                  <h2 className="font-black text-lg text-white group-hover:text-cyan-400 transition uppercase">
                    {game.title}
                  </h2>
                  <span className="text-xs text-gray-400 mt-1 mb-4 uppercase">
                    {game[consoleModelName]?.name || "Sin consola"}
                  </span>

                  <div className="grid grid-cols-3 gap-3 mt-auto">
                    <Link
                      href={`/games/${game.id}`}
                      className="relative text-center text-xs font-bold py-2 rounded-xl overflow-hidden border border-cyan-400/30 group transition"
                    >
                      <span className="relative z-10 text-cyan-400 group-hover:text-black transition">Ver</span>
                      <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-100 transition"></div>
                    </Link>

                    <Link
                      href={`/games/editar/${game.id}`}
                      className="relative text-center text-xs font-bold py-2 rounded-xl overflow-hidden border border-yellow-400/30 group transition"
                    >
                      <span className="relative z-10 text-yellow-400 group-hover:text-black transition">Editar</span>
                      <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-100 transition"></div>
                    </Link>

                    <form action={async () => { "use server"; await deleteGame(game.id); }}>
                      <button className="relative w-full text-xs font-bold py-2 rounded-xl overflow-hidden border border-red-400/30 group transition">
                        <span className="relative z-10 text-red-400 group-hover:text-white transition">Borrar</span>
                        <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-100 transition"></div>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PAGINACIÓN - (tu código sigue igual) */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-16 gap-3 pb-12">
            {Array.from({ length: totalPages }, (_, i) => {
              const pNum = i + 1;
              const active = currentPage === pNum;

              const query = new URLSearchParams();
              if (searchTerm) query.set("search", searchTerm);
              query.set("page", pNum.toString());

              return (
                <Link
                  key={pNum}
                  href={`/games?${query.toString()}`}
                  scroll={false} 
                  className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold transition-all ${
                    active
                      ? "bg-gradient-to-r from-cyan-400 to-blue-600 text-white scale-110"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {pNum}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}