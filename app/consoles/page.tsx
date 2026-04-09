import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import ConsolesInfo from "@/components/ConsolesInfo";

export default async function ConsolesPage({
  searchParams,
}: {
  searchParams: { search?: string; page?: string };
}) {
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/");
  }

  return <ConsolesInfo searchParams={searchParams} />;
}
