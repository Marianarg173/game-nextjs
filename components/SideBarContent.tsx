"use client";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { useUser } from "@stackframe/stack"; // 1. Importamos el hook de usuario
import { 
    SquaresFourIcon, 
    JoystickIcon, 
    GearIcon, 
    ComputerTowerIcon, 
} from "@phosphor-icons/react";

export default function SideBar() {
    const pathname = usePathname();
    const user = useUser(); // 2. Obtenemos la sesión actual

    // 3. REGLA DE ORO: Si no hay usuario (logout), el sidebar desaparece.
    // Esto evita que se vea el menú encima del formulario de login
    if (!user) return null;

    const navigation = [
        { name: "Dashboard", href: "/dashboard", icon: SquaresFourIcon },
        { name: "Games", href: "/games", icon: JoystickIcon },
        { name: "Consoles", href: "/consoles", icon: ComputerTowerIcon },
        /* Usamos account-settings que es la ruta que te funcionó */
        { name: "Settings", href: "/handler/account-settings", icon: GearIcon },
    ];

    return (
        <div className="flex flex-col h-screen bg-[#111625] w-[11rem] border-r border-white/5 sticky top-0 left-0 z-50 transition-all">
            <nav className="flex-1 p-2 pt-12 space-y-2 overflow-y-auto">
                {navigation.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = pathname.startsWith(item.href);

                    return (
                        <Link
                            href={item.href}
                            key={item.name}
                            className={`flex items-center gap-3 px-2 py-2 rounded-xl font-medium transition-all duration-200 ${
                                isActive
                                    ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <IconComponent size={18} weight={isActive ? "fill" : "regular"} />
                            <span className="text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}