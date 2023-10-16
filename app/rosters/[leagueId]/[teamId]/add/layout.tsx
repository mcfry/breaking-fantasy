import { Metadata } from "next";

import { Sidebar } from "@/components/Sidebar";
import { Separator } from "@/components/ui/separator";
import Team from "@/models/team";

export const metadata: Metadata = {
  title: "League",
  description: "League management.",
};

async function getLeague(leagueId: string) {
  const res = await fetch(`http://localhost:3000/api/leagues?id=${leagueId}`, {
    method: "GET",
    //cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

async function getTeam(teamId: string) {
  const res = await fetch(`http://localhost:3000/api/teams?id=${teamId}`, {
    method: "GET",
    //cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function RosterLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { leagueId: string; teamId: string };
}) {
  const league = await getLeague(params.leagueId);
  const team = await getTeam(params.teamId);

  const sidebarNavItems = [
    {
      title: `Team: ${team.name}`,
      href: `/rosters/${league._id}/${team._id}`,
    },
  ];

  if (league.type === "Manual") {
    sidebarNavItems.push({
      title: "Add Player",
      href: `/rosters/${league._id}/${team._id}/add`,
    });
  }

  return (
    <>
      <div className="flex flex-col space-y-2 p-10">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage team: {team.name} as part of the league {league.name}.
          </p>
        </div>

        <Separator />

        <div className="flex">
          <aside className="lg:w-1/5">
            <Sidebar
              items={sidebarNavItems}
              backPageHref={`/leagueTeams/${league.name}`}
              backPageDisplayText={`League: ${league.name}`}
            />
          </aside>
          <div className="flex-1 p-12">{children}</div>
        </div>
      </div>
    </>
  );
}
