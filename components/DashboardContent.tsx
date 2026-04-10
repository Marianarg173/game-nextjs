"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface DashboardData {
  totalGames: number;
  totalConsoles: number;
  avgGamesPerConsole: number;
  gamesPerConsole: { name: string; value: number; }[];
}

interface DashboardUser {
  name: string;
  email: string;
  image?: string | null;
}

export default function DashboardContent({ data, user }: { data: DashboardData; user: DashboardUser }) {
  const COLORS = ['#22c55e', '#2563eb', '#8b5cf6', '#f97316', '#ec4899', '#14b8a6'];

  return (
    <div className="w-full overflow-x-hidden">
      
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-12">
        
        {/* ENCABEZADO - Centrado en móvil */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white uppercase italic">
            Dashboard
          </h1>
          <p className="mt-2 text-xs md:text-sm text-slate-400 font-medium tracking-wide uppercase opacity-70">
            Resumen // {user.name}
          </p>
        </div>

        {/* STATS CARDS - 1 columna en cel, 3 en PC */}
        <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-3 mb-10">
          <StatBox label="Total games" value={data.totalGames} color="text-cyan-400" />
          <StatBox label="Total consoles" value={data.totalConsoles} color="text-cyan-400" />
          <StatBox label="Avg games / console" value={data.avgGamesPerConsole} color="text-fuchsia-400" />
        </div>

        {/* GRAFICAS Y LISTADO */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.4fr_1fr]">
          <div className="space-y-8">
            
            {/* Pie Chart - Responsivo */}
            <div className="rounded-[2rem] md:rounded-[2.5rem] bg-slate-900/40 p-6 md:p-8 border border-white/5 shadow-xl backdrop-blur-sm">
              <div className="mb-6">
                <h2 className="text-lg md:text-xl font-bold text-white">Juegos por consola</h2>
                <p className="text-xs text-slate-400 uppercase tracking-tighter">Distribución actual</p>
              </div>
              <div className="h-[280px] md:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.gamesPerConsole}
                      cx="50%"
                      cy="50%"
                      innerRadius="60%"
                      outerRadius="90%"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.gamesPerConsole.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart - Responsivo */}
            <div className="rounded-[2rem] md:rounded-[2.5rem] bg-slate-900/40 p-6 md:p-8 border border-white/5 shadow-xl backdrop-blur-sm">
              <div className="mb-6">
                <h2 className="text-lg md:text-xl font-bold text-white">Volumen de Juegos</h2>
                <p className="text-xs text-slate-400 uppercase tracking-tighter">Comparativa por plataforma</p>
              </div>
              <div className="h-[280px] md:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.gamesPerConsole}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', fontSize: '12px' }} />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Columna Lateral de Consolas */}
          <div className="rounded-[2rem] md:rounded-[2.5rem] bg-slate-900/40 p-6 md:p-8 border border-white/5 shadow-xl h-fit">
            <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-widest text-center md:text-left italic">Detalle de Consolas</h2>
            <div className="space-y-3">
              {data.gamesPerConsole.map((console) => (
                <div key={console.name} className="rounded-xl border border-white/5 bg-slate-950/50 p-4 transition active:scale-95 md:hover:bg-slate-900/50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-white text-sm">{console.name}</p>
                    <span className="text-[10px] font-black text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-md">
                      {console.value} PCS
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-all duration-1000"
                      style={{ width: `${Math.min(100, (console.value / data.totalGames) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* 📱 RESET PARA EVITAR ZOOM AUTOMÁTICO */
        html {
          font-size: 16px; 
        }

        body {
          overflow-x: hidden;
          -webkit-text-size-adjust: 100%;
        }

        /* Hacer que los textos sean legibles en móvil sin zoom */
        p, h1, h2, span {
          cursor: default;
        }

        /* Ajuste de Recharts para móviles */
        .recharts-responsive-container {
          min-width: 0 !important;
        }
      `}</style>
    </div>
  );
}

// Subcomponente para limpieza del código
function StatBox({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className="rounded-2xl bg-slate-900/50 p-5 border border-white/5 shadow-2xl flex flex-col justify-center items-center md:items-start transition-transform active:scale-95">
      <p className={`text-[10px] uppercase tracking-[0.2em] font-black ${color}`}>{label}</p>
      <p className="mt-2 text-4xl md:text-5xl font-black text-white italic">{value}</p>
    </div>
  );
}