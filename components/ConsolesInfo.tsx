import { PrismaClient } from "@/src/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import Link from "next/link";
import { deleteConsole } from "@/app/actions/consoleActions";
import SearchBar from "./SearchBar";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

export const dynamic = "force-dynamic";

export default async function ConsolesInfo({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }> | { search?: string; page?: string };
}) {
  // Aseguramos que los params estén disponibles (Next.js 15+ requiere await)
  const resolvedParams = await searchParams;
  const searchTerm = resolvedParams?.search || "";
  const currentPage = Number(resolvedParams?.page) || 1;
  const pageSize = 8;

  const p = prisma as any;
  const consoleModel = p.consoles || p.console;

  // Filtro de búsqueda por nombre
  const where = searchTerm
    ? { name: { contains: searchTerm, mode: "insensitive" as const } }
    : {};

  const [totalConsoles, consoles] = await Promise.all([
    consoleModel.count({ where }),
    consoleModel.findMany({
      where,
      include: { games: true },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      orderBy: { id: "desc" },
    }),
  ]);

  const totalPages = Math.ceil(totalConsoles / pageSize);
  const hasConsoles = consoles.length > 0;

  return (
    <div className="w-full">
      <div className="p-2 text-white">
        <h1 className="text-4xl font-black mb-8 text-center uppercase tracking-widest text-cyan-400">
           Consoles
        </h1>

        {/* El buscador ahora apunta correctamente a /consoles */}
        <div className="max-w-md mx-auto mb-10">
          <SearchBar 
            basePath="/consoles" 
            placeholder="Buscar consolas..." 
          />
        </div>

        <div className="mb-8 flex justify-between items-center max-w-7xl mx-auto">
          <p className="text-sm text-gray-400">
            {searchTerm ? `Resultados para "${searchTerm}": ` : "Mostrando "}
            <span className="text-cyan-400 font-bold">{consoles.length}</span> de {totalConsoles}
          </p>

          <Link href="/consoles/crear">
            <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black font-bold hover:scale-110 transition">
              + Nueva Consola
            </button>
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {!hasConsoles ? (
            <div className="col-span-full text-center py-24 bg-white/5 border border-white/10 rounded-3xl">
              <p className="text-2xl text-gray-400 font-bold">No hay consolas 😢</p>
            </div>
          ) : (
            consoles.map((console: any) => (
              <div
                key={console.id}
                className="group relative rounded-2xl overflow-hidden bg-black/40 backdrop-blur-xl border border-white/10 transition-all duration-500 hover:scale-[1.05] hover:shadow-[0_0_40px_rgba(0,255,255,0.4)]"
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
                  <div className="absolute inset-0 rounded-2xl border border-cyan-400 blur-md animate-pulse"></div>
                </div>

                <div className="relative h-56 overflow-hidden">
                  <img
                    src={`/imgs/${console.image}`}
                    alt={console.name}
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-125 group-hover:rotate-1"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  <div className="absolute top-3 right-3 px-3 py-1 bg-black/70 backdrop-blur-md rounded-lg border border-cyan-400/30">
                    <p className="text-cyan-400 font-bold text-sm">{console.games.length} juegos</p>
                  </div>
                </div>

                <div className="p-5 flex flex-col">
                  <h2 className="font-black text-lg text-white group-hover:text-cyan-400 transition uppercase">
                    {console.name}
                  </h2>
                  <span className="text-xs text-gray-400 mt-1 mb-4 uppercase">
                    {console.manufacturer}
                  </span>

                  <div className="grid grid-cols-3 gap-3 mt-auto">
                    <Link
                      href={`/consoles/${console.id}`}
                      className="relative text-center text-xs font-bold py-2 rounded-xl overflow-hidden border border-cyan-400/30 group transition"
                    >
                      <span className="relative z-10 text-cyan-400 group-hover:text-black transition">Ver</span>
                      <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-100 transition"></div>
                    </Link>

                    <Link
                      href={`/consoles/editar/${console.id}`}
                      className="relative text-center text-xs font-bold py-2 rounded-xl overflow-hidden border border-yellow-400/30 group transition"
                    >
                      <span className="relative z-10 text-yellow-400 group-hover:text-black transition">Editar</span>
                      <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-100 transition"></div>
                    </Link>

                    <form action={async () => { "use server"; await deleteConsole(console.id); }}>
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
                  href={`/consoles?${query.toString()}`}
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