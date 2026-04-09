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
    <div className="min-h-screen flex items-center justify-center relative p-6 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('/imgs/bg_game.png')] bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute w-[600px] h-[600px] bg-cyan-500/20 blur-[150px] top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-[150px] bottom-[-100px] right-[-100px]"></div>

      <form
        action={async (formData: FormData) => {
          "use server";
          await updateConsole(consoleItem.id, formData);
        }}
        className="relative z-10 w-full max-w-3xl p-[2px] rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 animate-border"
      >
        <div className="bg-gray-950/90 backdrop-blur-xl rounded-3xl p-8 space-y-6 border border-white/10">
          <h2 className="text-4xl font-black text-center uppercase tracking-widest bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Editar Consola
          </h2>

          <div className="grid grid-cols-1 gap-5">
            <input name="name" defaultValue={consoleItem.name} placeholder="Nombre" className="input-gamer" required />
            <input name="manufacturer" defaultValue={consoleItem.manufacturer} placeholder="Fabricante" className="input-gamer" required />
            <input
              type="date"
              name="releaseDate"
              defaultValue={new Date(consoleItem.releaseDate).toISOString().split("T")[0]}
              className="input-gamer"
              required
            />
            <div className="col-span-1">
              <input type="file" name="image" accept="image/*" className="input-gamer w-full" />
              <p className="mt-2 text-xs text-slate-400">Sube una nueva imagen solo si quieres reemplazar la actual.</p>
            </div>
            <textarea
              name="description"
              defaultValue={consoleItem.description}
              placeholder="Descripción"
              className="input-gamer min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button type="submit" className="btn-gamer bg-gradient-to-r from-cyan-400 to-blue-600">
              Guardar
            </button>
            <Link href="/consoles" className="btn-gamer bg-gradient-to-r from-red-500 to-pink-600 text-center">
              Cancelar
            </Link>
          </div>
        </div>
      </form>

      <style>{`
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
      `}</style>
    </div>
  );
}
