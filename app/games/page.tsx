// app/games/page.tsx
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import GamesInfo from "@/components/GamesInfo";

export default async function GamesPage(props: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    /* YA NO USES <SideBar> AQUÍ. El layout ya lo incluye. */
    <div className="w-full">
       <GamesInfo searchParams={props.searchParams} />
    </div>
  );
}