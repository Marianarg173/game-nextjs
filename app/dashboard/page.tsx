import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import DashboardContent from "@/components/DashboardContent";
import { PrismaClient } from "@/src/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

export default async function DashboardPage() {
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/");
  }

  const gamesModel = prisma.games;
  const consoleModel = prisma.console;

  const [totalGames, totalConsoles, consolesWithGames] = await Promise.all([
    gamesModel.count(),
    consoleModel.count(),
    consoleModel.findMany({
      include: { games: true },
    }),
  ]);

  const gamesPerConsole = consolesWithGames.map((console: any) => ({
    name: console.name,
    value: console.games.length,
  }));

  const dashboardData = {
    totalGames,
    totalConsoles,
    avgGamesPerConsole: totalConsoles > 0 ? +(totalGames / totalConsoles).toFixed(1) : 0,
    gamesPerConsole,
  };

  const currentUser = user as any;
  const dashboardUser = {
    name: currentUser?.name || currentUser?.displayName || currentUser?.email || "Usuario",
    email: currentUser?.email || "Sin email",
    image: currentUser?.image || currentUser?.avatar || null,
  };

  return <DashboardContent data={dashboardData} user={dashboardUser} />;
}