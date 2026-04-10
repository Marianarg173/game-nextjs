import { PrismaClient } from "@/src/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { updateConsole } from "@/app/actions/consoleActions";
import Link from "next/link";
import { notFound } from "next/navigation";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

export default async function EditConsole({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const consoleId = Number(id);

  if (isNaN(consoleId)) {
    return <div className="text-white flex items-center justify-center min-h-screen">ID inválido</div>;
  }

  const p = prisma as any;
  const consoleModel = p.consoles || p.console;

  const consoleItem = await consoleModel.findUnique({
    where: { id: consoleId },
  });

  if (!consoleItem) {
    return notFound();
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative p-4 md:p-10 text-white overflow-x-hidden">
      
      {/* 🎮 FONDO DINÁMICO */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/imgs/bg_game.png')] bg-cover bg-center opacity-40 scale-105"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      </div>

      {/* ✨ LUCES NEÓN RESPONSIVAS */}
      <div className="absolute w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-cyan-500/10 blur-[80px] md:blur-[150px] top-[-50px] left-[-50px]"></div>
      <div className="absolute w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-purple-500/10 blur-[80px] md:blur-[150px] bottom-[-50px] right-[-50px]"></div>

      {/* 🎮 FORMULARIO ADAPTADO */}
      <form
        action={async (formData: FormData) => {
          "use server";
          await updateConsole(consoleItem.id, formData);
        }}
        className="relative z-10 w-full max-w-2xl p-[2px] rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 animate-border"
      >
        <div className="bg-gray-950/95 backdrop-blur-2xl rounded-3xl p-6 md:p-8 space-y-6 border border-white/10">
          
          {/* HEADER */}
          <h2 className="text-2xl md:text-4xl font-black text-center uppercase tracking-tighter md:tracking-widest bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent italic">
            Editar Consola
          </h2>

          {/* GRID RESPONSIVO (1 col en cel, 2 en PC) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="flex flex-col gap-1">
               <label className="text-[10px] uppercase font-bold text-cyan-500 ml-2">Nombre</label>
               <input name="name" defaultValue={consoleItem.name} placeholder="Nombre" className="input-gamer" required />
            </div>
            
            <div className="flex flex-col gap-1">
               <label className="text-[10px] uppercase font-bold text-cyan-500 ml-2">Fabricante</label>
               <input name="manufacturer" defaultValue={consoleItem.manufacturer} placeholder="Fabricante" className="input-gamer" required />
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
               <label className="text-[10px] uppercase font-bold text-cyan-500 ml-2">Lanzamiento</label>
               <input
                 type="date"
                 name="releaseDate"
                 defaultValue={new Date(consoleItem.releaseDate).toISOString().split("T")[0]}
                 className="input-gamer"
                 required
               />
            </div>
          </div>

          {/* SECCIÓN IMAGEN (Con preview actual) */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-zinc-900/50 rounded-xl border border-white/5">
            <img
              src={`/imgs/${consoleItem.image}`}
              alt={consoleItem.name}
              className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border-2 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            />
            <div className="w-full text-center sm:text-left">
              <p className="text-[10px] text-zinc-500 uppercase font-bold mb-2 tracking-widest">Reemplazar Hardware Image</p>
              <input type="file" name="image" accept="image/*" className="text-xs w-full block file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-cyan-500 file:text-black hover:file:bg-cyan-400 cursor-pointer" />
            </div>
          </div>

          {/* DESCRIPCIÓN */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-cyan-500 ml-2">Descripción</label>
            <textarea
              name="description"
              defaultValue={consoleItem.description}
              placeholder="Descripción..."
              className="input-gamer min-h-[120px] text-sm"
            />
          </div>

          {/* BOTONES TUS COLORES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="submit"
              className="btn-gamer bg-gradient-to-r from-cyan-400 to-blue-600 order-1 sm:order-2"
            >
              Guardar
            </button>

            <Link
              href="/consoles"
              className="btn-gamer bg-gradient-to-r from-red-500 to-pink-600 text-center order-2 sm:order-1"
            >
              Cancelar
            </Link>
          </div>
        </div>
      </form>

      {/* 🎨 TUS ESTILOS UNIFICADOS */}
      <style>{`
        .input-gamer {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          background: rgba(10, 10, 20, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 0.875rem;
          transition: 0.3s;
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
          transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 13px;
        }

        .btn-gamer:active {
          transform: scale(0.95);
        }

        @media (min-width: 768px) {
          .btn-gamer:hover {
            transform: scale(1.02);
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.6);
          }
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
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}