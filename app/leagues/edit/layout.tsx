import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leagues",
  description: "Leagues edit.",
};

export default function LeaguesEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
