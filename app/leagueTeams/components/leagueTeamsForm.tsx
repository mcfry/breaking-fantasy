"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  LeagueTeamSchema,
  TLeagueTeamSchema,
  ExtendedLeagueTeamSchema,
  ExtendedLeagueSchema,
} from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

export function LeagueTeamsForm({
  league,
  team,
}: {
  league: ExtendedLeagueSchema;
  team: ExtendedLeagueTeamSchema | null;
}) {
  const router = useRouter();

  const form = useForm<TLeagueTeamSchema>({
    defaultValues: {
      leagueId: league._id,
      name: team ? team.name : "",
      user_display_name: team ? team.user_display_name : "",
    },
    resolver: zodResolver(LeagueTeamSchema),
  });

  const onSubmit = async (data: TLeagueTeamSchema) => {
    const response = await fetch("/api/teams", {
      method: team === null ? "POST" : "PATCH",
      body:
        team !== null
          ? JSON.stringify({
              ...team,
              ...data,
            })
          : JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      toast({
        variant: "destructive",
        title: "Submitting form failed with values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });

      return;
    } else {
      const responseData = await response.json();
      if (responseData.errors) {
        const errors = responseData.errors;
        if (errors.name) {
          form.setError("name", {
            type: "name",
            message: errors.name,
          });
        }

        if (errors.type) {
          form.setError("user_display_name", {
            type: "type",
            message: errors.type,
          });
        }

        if (!errors.name && !errors.type) {
          toast({
            variant: "destructive",
            title: "Something went wrong",
            description: (
              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <code className="text-white">Oopsies.</code>
              </pre>
            ),
          });
        }
      } else {
        toast({
          title: "Submission successful",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">You the greatest!</code>
            </pre>
          ),
        });

        router.refresh();
        router.push("/leagues");
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input placeholder="Best team evar" {...field} />
              </FormControl>
              <FormDescription>Enter the name of your team.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="user_display_name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="scrubmaster3000" {...field} />
              </FormControl>
              <FormDescription>
                Enter the team owner&apos;s name/nickname/username
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="leagueId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
