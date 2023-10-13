"use client";

import { useRouter } from "next/navigation";
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
import { toast } from "@/components/ui/use-toast";
import { removeStarters } from "@/lib/utils";

import { getLeagues, getRosters, getUsers } from "@/client-api/sleeper";
import { getPlayers } from "@/client-api/players";

import { TSleeperLeagueSchema, TSleeperRosterSchema } from "@/lib/types";

// TODO: figure out sleeper's exact constraints
const username = z.string().min(2).max(20);

export default function LeaguesAdd() {
  const router = useRouter();
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

  let playerIds: string[] = [];
  if (importedRostersData) {
    playerIds = [];

    importedRostersData.map((roster: TSleeperRosterSchema) => {
      playerIds = [
        ...playerIds,
        ...roster.players.filter((item: string) => item !== "0"),
      ];
    });
  }

  const {
    data: sleeperPlayersData,
    isLoading: sleeperPlayersLoading,
    isError: sleeperPlayersError,
  } = useQuery({
    queryKey: ["sleeperPlayers", selectValue],
    queryFn: () => getPlayers(playerIds),
    enabled: playerIds.length > 0,
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

  const handleCreateFromImport = async () => {
    if (leaguesData && selectValue) {
      const leagueIndex = leaguesData.findIndex(
        (league) => league.league_id === selectValue
      );

      const response = await fetch("/api/leagues", {
        method: "POST",
        body: JSON.stringify({
          type: "Sleeper",
          leagueId: selectValue,
          name: leaguesData[leagueIndex].name,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Importing league failed with values:",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(selectValue, null, 2)}
              </code>
            </pre>
          ),
        });

        return;
      } else {
        const responseData = await response.json();
        if (responseData.errors) {
          const errors = responseData.errors;
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
    } else {
      toast({
        title: "Error",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">No league data.</code>
          </pre>
        ),
      });
    }
  };

  if (
    leaguesLoading ||
    importedRostersLoading ||
    importedUsersLoading ||
    sleeperPlayersLoading
  ) {
    return (
      <section className="flex flex-col items-center justify-center space-y-10">
        <span>Loading....</span>
        <Loader2 className="h-12 w-12 animate-spin" />
      </section>
    );
  }

  const getStage = () => {
    if (!leaguesData) return 1;
    if (leaguesData && (!importedRostersData || !importedUsersData)) return 2;
    if (importedRostersData && importedUsersData) return 3;

    throw new Error("No valid stage");
  };

  return (
    <section className="flex flex-col items-center justify-center space-y-10">
      <div className="flex flex-col w-3/5 space-y-8">
        {getStage() === 1 && (
          <>
            <div>
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
            </div>

            <div className="button-wrapper">
              <Button type="button" onClick={() => handleGetLeagues()}>
                Get Sleeper Info
              </Button>
            </div>
          </>
        )}

        {getStage() === 2 && (
          <>
            <div className="select-wrapper">
              <Select value={selectValue} onValueChange={setSelectValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Select one of your leagues" />
                </SelectTrigger>
                <SelectContent>
                  {leaguesData?.map((league: TSleeperLeagueSchema) => (
                    <SelectItem key={league.league_id} value={league.league_id}>
                      {league.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="button-wrapper">
              <Button type="button" onClick={() => handleImportLeague()}>
                Import Sleeper League
              </Button>
            </div>
          </>
        )}

        {getStage() === 3 && (
          <>
            <Button type="button" onClick={() => handleCreateFromImport()}>
              Confirm this League
            </Button>

            <div className="grid grid-cols-2 gap-12">
              {importedRostersData?.map((roster: TSleeperRosterSchema) => {
                const removedStarterZeros = roster.starters.filter(
                  (item: string) => item !== "0"
                );

                const removedPlayerZeros = roster.players.filter(
                  (item: string) => item !== "0"
                );

                return (
                  <div
                    key={roster.owner_id}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <span className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        &nbsp;
                        {importedUsersData &&
                          importedUsersData[roster.owner_id].display_name}
                        &nbsp;
                      </span>
                      <span className="scroll-m-20 font-semibold tracking-tight">
                        &nbsp;
                        {importedUsersData &&
                          importedUsersData[roster.owner_id].team_name}
                        &nbsp;
                      </span>
                    </div>
                    <ul className="col-span-1 flex flex-col items-center border-t-2 border-primary rounded-none">
                      {removedStarterZeros.map((starter: string) => {
                        return (
                          <li
                            key={starter}
                            className="flex justify-center items-center w-full p-2 border-b-2 border-l-2 border-r-2 border-primary rounded-none"
                          >
                            <span>
                              {sleeperPlayersData[starter].full_name ||
                                sleeperPlayersData[starter].team}
                            </span>
                          </li>
                        );
                      })}

                      {removeStarters(
                        removedStarterZeros as string[],
                        removedPlayerZeros as string[]
                      ).map((benched) => {
                        return (
                          <li
                            key={benched}
                            className="flex justify-center items-center w-full p-2 border-b-2 border-l-2 border-r-2 border-primary rounded-none"
                          >
                            <span>
                              {sleeperPlayersData[benched].full_name ||
                                sleeperPlayersData[benched].team}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
