"use client";

export default function ConsoleFilter({ defaultValue }: { defaultValue: string }) {
  const manufacturers = ["Nintendo", "Sony", "Microsoft", "Sega"];

  return (
    <div className="relative w-full md:w-44"> {/* Ancho reducido de 64 a 44 */}
      <select
        defaultValue={defaultValue}
        onChange={(e) => {
          const val = e.target.value;
          const params = new URLSearchParams(window.location.search);
          if (val) params.set("search", val);
          else params.delete("search");
          params.set("page", "1");
          window.location.href = `/consoles?${params.toString()}`;
        }}
        className="w-full bg-black/40 text-cyan-400 border border-cyan-400/30 px-3 py-2 rounded-xl focus:outline-none focus:border-cyan-400 hover:bg-cyan-400/10 transition cursor-pointer appearance-none text-xs font-bold backdrop-blur-md"
      >
        <option value="" className="bg-gray-900 text-white">Fabricante</option>
        {manufacturers.map((m) => (
          <option key={m} value={m} className="bg-gray-900 text-white">{m}</option>
        ))}
      </select>
      
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-cyan-400 text-[10px]">
        ▼
      </div>
    </div>
  );
}