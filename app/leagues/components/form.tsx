"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { LeagueSchema, TLeagueSchema, ExtendedLeagueSchema } from "@/lib/types";

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

export function InputForm({ league }: { league: ExtendedLeagueSchema | null }) {
  const router = useRouter();

  const form = useForm<TLeagueSchema>({
    defaultValues: {
      name: league ? league.name : "",
      type: league ? league.type : "Manual",
    },
    resolver: zodResolver(LeagueSchema),
  });

  const onSubmit = async (data: TLeagueSchema) => {
    const response = await fetch("/api/leagues", {
      method: league === null ? "POST" : "PATCH",
      body:
        league !== null
          ? JSON.stringify({
              ...league,
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
          form.setError("type", {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>League Name</FormLabel>
              <FormControl>
                <Input placeholder="Best league evar" {...field} />
              </FormControl>
              <FormDescription>Enter the name of your league.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
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
