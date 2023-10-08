import LeagueClientActions from "./components/leagueClientActions";
import { ExtendedLeagueSchema } from "@/lib/types";

async function getMyLeagues() {
  const res = await fetch("http://localhost:3000/api/leagues", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function LeagueHome() {
  const { leagues }: { leagues: ExtendedLeagueSchema[] } = await getMyLeagues();

  return (
    <section className="flex flex-col items-center justify-center">
      <ul role="list" className="w-3/5 divide-y divide-gray-100">
        {leagues.map((league: ExtendedLeagueSchema) => {
          return (
            <li key={league._id} className="flex justify-between gap-x-6 py-5">
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {league.name}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {league.type}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Created at: {league.createdAt.toLocaleString()}
                </p>

                <LeagueClientActions id={league._id} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
