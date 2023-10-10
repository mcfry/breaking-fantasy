"use client";

import { useState, useRef } from "react";
import { z } from "zod";

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
import { xorLists } from "@/lib/utils";

// TODO: figure out exact constraints
const username = z.string().min(2).max(20);

export default function LeaguesAdd() {
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const [userIdSearched, setUserIdSearched] = useState("");
  const [sleeperLeagues, setSleeperLeagues] = useState<any>();
  const [sleeperRosters, setSleeperRosters] = useState<any>();
  const [sleeperUsers, setSleeperUsers] = useState<any>();
  const [selectValue, setSelectValue] = useState("");

  const handleGetLeagues = async () => {
    if (usernameRef.current) {
      const userParse = username.safeParse(usernameRef.current?.value);
      if (userParse.success === true) {
        fetch(`https://api.sleeper.app/v1/user/${usernameRef.current?.value}`, {
          method: "GET",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data) {
              setUserIdSearched(data.user_id);

              fetch(
                `https://api.sleeper.app/v1/user/${data.user_id}/leagues/nfl/2023`,
                {
                  method: "GET",
                }
              )
                .then((res) => res.json())
                .then((data) => {
                  if (data) {
                    console.log(data);
                    setSleeperLeagues(data);
                  }
                });
            }
          });
      }
    }
  };

  const handleImportLeague = () => {
    if (selectValue) {
      fetch(`https://api.sleeper.app/v1/league/${selectValue}/rosters`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) setSleeperRosters(data);
        });

      fetch(`https://api.sleeper.app/v1/league/${selectValue}/users`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) setSleeperUsers(data);
        });
    }
  };

  return (
    <section className="flex flex-col items-center justify-center space-y-10">
      <h4 className="text-xl font-bold">Import League</h4>
      {!userIdSearched && (
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

      {sleeperLeagues && (!sleeperRosters || !sleeperUsers) && (
        <>
          <Select value={selectValue} onValueChange={setSelectValue}>
            <SelectTrigger className="w-3/5">
              <SelectValue placeholder="Select one of your leagues" />
            </SelectTrigger>
            <SelectContent>
              {sleeperLeagues.map((league: any) => (
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

      {sleeperRosters && sleeperUsers && (
        <>
          {sleeperRosters.map((roster: any) => {
            return (
              <ul key={roster.owner_id}>
                {roster.starters.map((starter: number, index: number) => {
                  return <li key={starter}>{starter}</li>;
                })}

                {xorLists(
                  roster.starters as number[],
                  roster.players as number[]
                ).map((starter) => {
                  return <li key={starter}>{starter}</li>;
                })}
              </ul>
            );
          })}
        </>
      )}
    </section>
  );
}
