"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useDebounce } from "@/lib/hooks";
import {
  PlayerAddSchema,
  TPlayerAddSchema,
  ExtendedLeagueSchema,
  ExtendedLeagueTeamSchema,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const positions = ["QB", "WR", "RB", "TE", "ANY"];

type DebouncedPlayer = {
  _id: string;
  first_name: string;
  last_name: string;
  position: string;
};

export function RostersForm({
  league,
  team,
}: {
  league: ExtendedLeagueSchema;
  team: ExtendedLeagueTeamSchema;
}) {
  const [open, setOpen] = useState(false);
  const [playerId, setPlayerId] = useState("");
  const [debouncedPlayers, debouncePlayersRequest] = useDebounce(300);

  const form = useForm<TPlayerAddSchema>({
    defaultValues: {
      player_name: "",
      position: "",
    },
    resolver: zodResolver(PlayerAddSchema),
  });

  const handleValueChange = async (searchValue: string) => {
    const data = form.getValues();

    if (searchValue && data.position) {
      debouncePlayersRequest(() =>
        fetch(`/api/players?search=${searchValue}&position=${data.position}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
      );
    }
  };

  const handleSubmit = () => {
    // add playerId to team players PATCH
  };

  const { position } = form.getValues();

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="w-2/3 grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Position" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {positions.map((position: string) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the player&apos;s position.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="player_name"
          render={({ field }) => (
            <FormItem className="flex flex-col mt-2">
              <FormLabel>Player</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      disabled={!position}
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value && debouncedPlayers
                        ? debouncedPlayers.find(
                            (player: DebouncedPlayer) =>
                              `${player.first_name} ${player.last_name}` ===
                              field.value
                          )?.last_name
                        : "Select a Player"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput
                      onValueChange={handleValueChange}
                      placeholder="Search players..."
                    />
                    <CommandEmpty>No players found.</CommandEmpty>
                    <CommandGroup>
                      {debouncedPlayers &&
                        debouncedPlayers.map((player: DebouncedPlayer) => {
                          const full_name = `${player.first_name} ${player.last_name}`;

                          return (
                            <CommandItem
                              value={full_name}
                              key={full_name}
                              onSelect={() => {
                                form.setValue("player_name", full_name);
                                setOpen(false);
                                setPlayerId(player._id);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  full_name === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {full_name}
                            </CommandItem>
                          );
                        })}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>The player to add to the team.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Add Player</Button>
      </form>
    </Form>
  );
}
