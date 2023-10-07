import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leagues",
  description: "Leagues create.",
};

export default function LeaguesCreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
