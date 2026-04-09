"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function SearchBar({
  basePath = "/games",
  placeholder = "Buscar juegos...",
}: {
  basePath?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Inicializamos el estado una sola vez con el valor de la URL
  const [search, setSearch] = useState(searchParams.get("search") || "");
  
  // Usamos una referencia para saber si es el primer render y evitar ejecuciones innecesarias
  const isInitialRender = useRef(true);

  // 1. Sincroniza el input solo si el usuario usa las flechas de atrás/adelante del navegador
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (search !== currentSearch) {
      setSearch(currentSearch);
    }
  }, [searchParams]);

  // 2. Debounce corregido
  useEffect(() => {
    // Evitamos que se ejecute al cargar la página por primera vez
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const delay = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const currentSearchInUrl = params.get("search") || "";

      // Solo actuamos si el texto del input es diferente al de la URL actual
      if (search !== currentSearchInUrl) {
        if (search) {
          params.set("search", search);
        } else {
          params.delete("search");
        }

        // SOLO reseteamos la página si la búsqueda cambió de verdad
        params.set("page", "1");

        router.push(`${basePath}?${params.toString()}`);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [search, router]); 

  return (
    <div className="mb-6 flex justify-center">
      <div className="relative w-full max-w-xl">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full px-5 py-3 rounded-xl bg-gray-900/70 backdrop-blur-md 
          border border-gray-600 text-white placeholder-gray-400
          focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40
          transition"
        />
      </div>
    </div>
  );
}