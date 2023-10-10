import { LeaguesForm } from "../components/leaguesForm";

export default function LeaguesAdd() {
  return (
    <section className="flex flex-col items-center justify-center">
      Add League
      <LeaguesForm league={null} />
    </section>
  );
}
