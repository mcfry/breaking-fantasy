"use client";

import { useState, useRef } from "react";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { removeStarters } from "@/lib/utils";

import { getLeagues, getRosters, getUsers } from "@/client-api/sleeper";

// TODO: figure out sleeper's exact constraints
const username = z.string().min(2).max(20);

export default function LeaguesAdd() {
  const queryClient = useQueryClient();
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const [selectValue, setSelectValue] = useState(""); // use zustand / context prob, if dont want reset upon renavigation

  const [isLeaguesQueryEnabled, setIsLeaguesQueryEnabled] = useState(false);
  const [isImportedQueryEnabled, setIsImportedQueryEnabled] = useState(false);

  const {
    data: leaguesData,
    isLoading: leaguesLoading,
    isError: leaguesError,
  } = useQuery({
    queryKey: ["leagues"],
    queryFn: () => getLeagues(usernameRef.current?.value),
    enabled: isLeaguesQueryEnabled,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const {
    data: importedRostersData,
    isLoading: importedRostersLoading,
    isError: importedRostersError,
  } = useQuery({
    queryKey: ["importedRosters", selectValue],
    queryFn: () => getRosters(selectValue),
    enabled: isImportedQueryEnabled,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const {
    data: importedUsersData,
    isLoading: importedUsersLoading,
    isError: importedUsersError,
  } = useQuery({
    queryKey: ["importedUsers", selectValue],
    queryFn: () => getUsers(selectValue),
    enabled: isImportedQueryEnabled,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const handleGetLeagues = async () => {
    if (usernameRef.current) {
      queryClient.setQueryData(["leagues"], null);
      queryClient.invalidateQueries({
        queryKey: ["leagues"],
      });
      setIsLeaguesQueryEnabled(true);
    }
  };

  const handleImportLeague = () => {
    if (selectValue) {
      queryClient.setQueryData(["importedRosters", selectValue], null);
      queryClient.invalidateQueries({
        queryKey: ["importedRosters", selectValue],
      });

      queryClient.setQueryData(["importedUsers", selectValue], null);
      queryClient.invalidateQueries({
        queryKey: ["importedUsers", selectValue],
      });

      setIsImportedQueryEnabled(true);
    }
  };

  if (leaguesLoading || importedRostersLoading || importedUsersLoading) {
    return (
      <section className="flex flex-col items-center justify-center space-y-10">
        <span>Loading....</span>
        <Loader2 className="h-12 w-12 animate-spin" />
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center space-y-10">
      <h4 className="text-xl font-bold">Import League</h4>
      {!leaguesData && (
        <div className="w-3/5 space-y-2">
          <Label
            htmlFor="username"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Sleeper Username
          </Label>
          <Input
            ref={usernameRef}
            type="text"
            name="username"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <p className="text-sm text-muted-foreground">
            Enter your Sleeper username.
          </p>

          <Button type="button" onClick={() => handleGetLeagues()}>
            Get Sleeper Info
          </Button>
        </div>
      )}

      {leaguesData && (!importedRostersData || !importedUsersData) && (
        <>
          <Select value={selectValue} onValueChange={setSelectValue}>
            <SelectTrigger className="w-3/5">
              <SelectValue placeholder="Select one of your leagues" />
            </SelectTrigger>
            <SelectContent>
              {leaguesData.map((league: any) => (
                <SelectItem key={league.league_id} value={league.league_id}>
                  {league.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="button" onClick={() => handleImportLeague()}>
            Import Sleeper League
          </Button>
        </>
      )}

      {importedRostersData && importedUsersData && (
        <>
          {importedRostersData.map((roster: any) => {
            const removedStarterZeros = roster.starters.filter(
              (item: string) => item !== "0"
            );

            const removedPlayerZeros = roster.players.filter(
              (item: string) => item !== "0"
            );

            return (
              <ul key={roster.owner_id}>
                {removedStarterZeros.map((starter: string, index: number) => {
                  return <li key={starter}>{starter}</li>;
                })}

                {removeStarters(
                  removedStarterZeros as string[],
                  removedPlayerZeros as string[]
                ).map((benched) => {
                  return <li key={benched}>{benched}</li>;
                })}
              </ul>
            );
          })}
        </>
      )}
    </section>
  );
}
