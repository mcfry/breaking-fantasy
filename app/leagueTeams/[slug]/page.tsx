import React, { Fragment } from "react";
import Link from "next/link";
import { formatMongoDate } from "@/lib/utils";
import { getRosters, getUsers } from "@/client-api/sleeper";
import { getPlayers } from "@/client-api/players";

import {
  TSleeperRosterSchema,
  TUserRosterInfo,
  ExtendedLeagueTeamSchema,
} from "@/lib/types";
import { SleeperRosters } from "../components/sleeperRosters";

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

async function getTeams(leagueId: string) {
  const res = await fetch(
    `http://localhost:3000/api/teams?leagueId=${leagueId}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

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
  if (!league) {
    return (
      <section className="flex flex-col justify-center items-center space-y-2">
        <h1 className="scroll-m-20 font-extrabold tracking-tight text-5xl">
          League doesn&apos;t exist
        </h1>
      </section>
    );
  }

  let rosters: TSleeperRosterSchema[] = [];
  let users: Record<string, TUserRosterInfo> = {};
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

  let teams: ExtendedLeagueTeamSchema[] = [];
  if (league.type === "Manual") {
    teams = await getTeams(league._id);
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
        {rosters && users && players && (
          <SleeperRosters rosters={rosters} users={users} players={players} />
        )}

        {teams &&
          teams.map((team: ExtendedLeagueTeamSchema) => {
            return (
              <React.Fragment key={team._id}>
                <div className="flex flex-col items-center justify-center">
                  <span className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    &nbsp;
                    {team.name}
                    &nbsp;
                  </span>
                  <span className="scroll-m-20 font-semibold tracking-tight">
                    &nbsp;
                    {team.user_display_name}
                    &nbsp;
                  </span>

                  <div className="flex flex-col items-center justify-center mt-4">
                    <div>{team.players.length} Players</div>
                    <Link href={`/rosters/${league._id}/${team._id}/add`}>
                      Add Players
                    </Link>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
      </div>
    </section>
  );
}
