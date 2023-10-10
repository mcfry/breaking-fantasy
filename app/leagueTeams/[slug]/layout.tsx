import { Metadata } from "next";

import { Sidebar } from "@/components/Sidebar";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "League",
  description: "League management.",
};

export default function LeagueTeamsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const leagueName = decodeURIComponent(params.slug);

  const sidebarNavItems = [
    {
      title: `League: ${leagueName}`,
      href: `/teams/${params.slug}`,
    },
    {
      title: "Add Team",
      href: "/teams/add",
    },
  ];

  return (
    <>
      <div className="flex flex-col space-y-2 p-10">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your league.</p>
        </div>

        <Separator />

        <div className="flex">
          <aside className="lg:w-1/5">
            <Sidebar
              items={sidebarNavItems}
              backPageHref="/leagues"
              backPageDisplayText="Leagues"
            />
          </aside>
          <div className="flex-1 p-12">{children}</div>
        </div>
      </div>
    </>
  );
}
