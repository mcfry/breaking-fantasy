import { LeagueTeamsForm } from "../../components/leagueTeamsForm";

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

export default async function LeagueTeamsAdd({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string };
}) {
  const league = await getLeague(params.slug);
  if (league.type === "Sleeper" || league.type === "ESPN") {
    return (
      <section className="flex flex-col justify-center items-center space-y-2">
        <h1 className="scroll-m-20 font-extrabold tracking-tight text-5xl">
          League type must be Manual to add a team
        </h1>
      </section>
    );
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
      <LeagueTeamsForm league={league} team={null} />
    </section>
  );
}
