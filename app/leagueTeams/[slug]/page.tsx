import { formatMongoDate } from "@/lib/utils";

async function getLeague(slug: string) {
  const res = await fetch(`http://localhost:3000/api/leagues?slug=${slug}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function LeagueTeams({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string };
}) {
  const league = await getLeague(params.slug);

  return (
    <section className="flex flex-col justify-center space-y-2">
      <h1 className="scroll-m-20 font-extrabold tracking-tight text-5xl">
        {league.name}
      </h1>
      <h3 className="scroll-m-20 font-bold tracking-tight text-3xl">
        {league.type}
      </h3>
      <h5 className="scroll-m-20 italic tracking-tight text-xl">
        {formatMongoDate(league.createdAt)}
      </h5>
    </section>
  );
}
