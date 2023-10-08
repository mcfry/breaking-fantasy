"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";

export default function LeagueClientActions({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    const response = await fetch(`/api/leagues?id=${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      toast({
        variant: "destructive",
        title: "Submitting form failed with values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{id}</code>
          </pre>
        ),
      });

      return;
    } else {
      const responseData = await response.json();
      if (responseData.errors) {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">Oopsies.</code>
            </pre>
          ),
        });
      } else {
        toast({
          title: "Delete successful",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">You the greatest!</code>
            </pre>
          ),
        });

        router.refresh();
      }
    }
  };

  return (
    <p className="mt-1 text-xs leading-5 text-red-500">
      <Link href={`/leagues/edit?id=${id}`}>Edit</Link> |{" "}
      <button type="button" onClick={handleDelete}>
        Delete
      </button>
    </p>
  );
}
