import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leagues",
  description: "Edit a league.",
};

export default function LeaguesEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
