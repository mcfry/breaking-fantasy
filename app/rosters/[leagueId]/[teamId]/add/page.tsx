import { RostersForm } from "@/app/rosters/components/rostersForm";

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

async function getTeam(id: string) {
  const res = await fetch(`http://localhost:3000/api/teams?id=${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Roster({
  params,
}: {
  params: { leagueId: string; teamId: string };
}) {
  const league = await getLeague(params.leagueId);
  const team = await getTeam(params.teamId);

  return (
    <section className="flex flex-col justify-center items-center space-y-4">
      <span className="text-2xl">Current</span>
      {team.players.map((player: any) => {
        return <>{player}</>;
      })}

      <RostersForm team={team} league={league} />
    </section>
  );
}
