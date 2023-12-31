import { LeaguesForm } from "../components/leaguesForm";

// TODO: update url with process.env, has to be absolute value...
async function getLeague(id: string) {
  const res = await fetch(`http://localhost:3000/api/leagues?id=${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function LeaguesEdit({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string };
}) {
  const league = await getLeague(searchParams?.id);

  return (
    <section className="flex flex-col items-center justify-center">
      <LeaguesForm league={league} />
    </section>
  );
}
