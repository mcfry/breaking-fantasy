import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teams",
  description: "Add a team.",
};

export default function LeagueTeamsAddLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
