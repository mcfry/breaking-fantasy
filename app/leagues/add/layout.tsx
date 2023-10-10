import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leagues",
  description: "Add a league.",
};

export default function LeaguesAddLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
