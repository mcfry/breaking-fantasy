import { formatMongoDate } from "@/lib/utils";
import { getRosters, getUsers } from "@/client-api/sleeper";
import { getPlayers } from "@/client-api/players";
import { removeStarters } from "@/lib/utils";

import { TSleeperRosterSchema } from "@/lib/types";

async function getLeague(slug: string) {
  const res = await fetch(`http://localhost:3000/api/leagues?slug=${slug}`, {
    method: "GET",
    //cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

async function getLeagueInfo(leagueId: string) {
  const rosters = await getRosters(leagueId);
  const users = await getUsers(leagueId);

  return { rosters, users };
}

export default async function LeagueTeams({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string };
}) {
  const league = await getLeague(params.slug);
  let rosters = null;
  let users: any = null;
  let playerIds: string[] = [];
  let players: any = [];

  if (league.type === "Sleeper") {
    ({ rosters, users } = await getLeagueInfo(league.leagueId));

    if (rosters) {
      playerIds = [];

      rosters.map((roster: TSleeperRosterSchema) => {
        playerIds = [
          ...playerIds,
          ...roster.players.filter((item: string) => item !== "0"),
        ];
      });
    }

    players = await getPlayers(playerIds);
  }

  if (!league) {
    return (
      <section className="flex flex-col justify-center items-center space-y-2">
        <h1 className="scroll-m-20 font-extrabold tracking-tight text-5xl">
          League doesn&apos;t exist
        </h1>
      </section>
    );
  }

  return (
    <section className="flex flex-col justify-center space-y-2">
      <h1 className="scroll-m-20 font-extrabold tracking-tight text-5xl">
        {league.name}
      </h1>
      <h3 className="scroll-m-20 font-bold tracking-tight text-3xl">
        {league.type}
      </h3>
      <h5 className="scroll-m-20 italic tracking-tight text-xl">
        {formatMongoDate(league?.createdAt)}
      </h5>

      <div className="grid grid-cols-2 gap-12 !mt-12">
        {rosters?.map((roster: TSleeperRosterSchema) => {
          const removedStarterZeros = roster.starters.filter(
            (item: string) => item !== "0"
          );

          const removedPlayerZeros = roster.players.filter(
            (item: string) => item !== "0"
          );

          return (
            <div key={roster.owner_id} className="flex flex-col space-y-2">
              <div className="flex flex-col items-center justify-center">
                <span className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  &nbsp;
                  {users && users[roster.owner_id].display_name}
                  &nbsp;
                </span>
                <span className="scroll-m-20 font-semibold tracking-tight">
                  &nbsp;
                  {users && users[roster.owner_id].team_name}
                  &nbsp;
                </span>
              </div>
              <ul className="col-span-1 flex flex-col items-center border-t-2 border-primary rounded-none">
                {removedStarterZeros.map((starter: string) => {
                  return (
                    <li
                      key={starter}
                      className="flex justify-center items-center w-full p-2 border-b-2 border-l-2 border-r-2 border-primary rounded-none"
                    >
                      <span>
                        {players[starter].full_name || players[starter].team}
                      </span>
                    </li>
                  );
                })}

                {removeStarters(
                  removedStarterZeros as string[],
                  removedPlayerZeros as string[]
                ).map((benched) => {
                  return (
                    <li
                      key={benched}
                      className="flex justify-center items-center w-full p-2 border-b-2 border-l-2 border-r-2 border-primary rounded-none"
                    >
                      <span>
                        {players[benched].full_name || players[benched].team}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
