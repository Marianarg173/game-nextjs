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
    /* 1. Quitamos el min-h-screen y el fondo oscuro para que use el del layout */
    <div className="w-full">
      
      {/* 2. Ajustamos el padding superior (pt-12) para que baje el contenido respecto al Header */}
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-12">
        
        {/* ENCABEZADO */}
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight text-white uppercase">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-400 font-medium">Resumen general de juegos, consolas y distribución por consola.</p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-10">
          <div className="rounded-3xl bg-slate-900/50 p-6 border border-white/5 shadow-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-bold">Total games</p>
            <p className="mt-4 text-5xl font-black text-white">{data.totalGames}</p>
          </div>
          <div className="rounded-3xl bg-slate-900/50 p-6 border border-white/5 shadow-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-bold">Total consoles</p>
            <p className="mt-4 text-5xl font-black text-white">{data.totalConsoles}</p>
          </div>
          <div className="rounded-3xl bg-slate-900/50 p-6 border border-white/5 shadow-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-400 font-bold">Avg games / console</p>
            <p className="mt-4 text-5xl font-black text-white">{data.avgGamesPerConsole}</p>
          </div>
        </div>

        {/* GRAFICAS Y LISTADO */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.4fr_1fr]">
          <div className="space-y-8">
            {/* Pie Chart */}
            <div className="rounded-[2.5rem] bg-slate-900/40 p-8 border border-white/5 shadow-xl">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">Juegos por consola</h2>
                <p className="text-sm text-slate-400">Distribución actual de juegos registrados.</p>
              </div>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.gamesPerConsole}
                      cx="50%"
                      cy="50%"
                      innerRadius={80} /* Estilo Donut para que se vea más moderno */
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.gamesPerConsole.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="rounded-[2.5rem] bg-slate-900/40 p-8 border border-white/5 shadow-xl">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">Juegos por año</h2>
                <p className="text-sm text-slate-400">Lanzamientos históricos.</p>
              </div>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.gamesPerConsole}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px' }} />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Columna Lateral de Consolas */}
          <div className="rounded-[2.5rem] bg-slate-900/40 p-8 border border-white/5 shadow-xl h-fit">
            <h2 className="text-xl font-bold text-white mb-6">Detalle de Consolas</h2>
            <div className="space-y-4">
              {data.gamesPerConsole.map((console) => (
                <div key={console.name} className="rounded-2xl border border-white/5 bg-slate-950/50 p-5 transition hover:bg-slate-900/50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-white">{console.name}</p>
                    <span className="text-xs font-black text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-lg">
                      {console.value} JUEGOS
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
    </div>
  );
}