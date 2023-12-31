import { Metadata } from "next";

import { Sidebar } from "../../components/Sidebar";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Leagues",
  description: "Leagues home.",
};

const sidebarNavItems = [
  {
    title: "My Leagues",
    href: "/leagues",
  },
  {
    title: "Add League",
    href: "/leagues/add",
  },
  {
    title: "Import League",
    href: "/leagues/import",
  },
];

export default function LeaguesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col space-y-2 p-10">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your leagues.</p>
        </div>

        <Separator />

        <div className="flex">
          <aside className="lg:w-1/5">
            <Sidebar
              items={sidebarNavItems}
              backPageHref={null}
              backPageDisplayText={null}
            />
          </aside>
          <div className="flex-1 p-12">{children}</div>
        </div>
      </div>
    </>
  );
}
