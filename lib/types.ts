import { z } from "zod";

// --

const validLeagueTypes = ["Manual", "Sleeper", "ESPN"];
export const LeagueSchema = z.object({
  name: z.string().min(4, {
    message: "League name must be at least 4 characters.",
  }),
  type: z.string().refine((val) => validLeagueTypes.includes(val), {
    message: "Invalid league type",
  }),
  leagueId: z.string().optional(),
});

export type TLeagueSchema = z.infer<typeof LeagueSchema>;

export type ExtendedLeagueSchema = TLeagueSchema & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

// --

export const SleeperRosterSchema = z.object({
  starters: z.array(z.string()),
  settings: z.object({
    wins: z.number(),
    waiver_position: z.number(),
    waiver_budget_used: z.number(),
    total_moves: z.number(),
    ties: z.number(),
    losses: z.number(),
    fpts_decimal: z.number(),
    fpts_decimal_against: z.number(),
    fpts_against: z.number(),
    fpts: z.number(),
  }),
  roster_id: z.number(),
  reserve: z.array(z.string()),
  players: z.array(z.string()),
  owner_id: z.string(),
  league_id: z.string(),
});

export type TSleeperRosterSchema = z.infer<typeof SleeperRosterSchema>;

// --

export const SleeperLeagueSchema = z.object({
  total_rosters: z.number(),
  status: z.string(),
  sport: z.string(),
  settings: z.any(),
  season_type: z.string(),
  season: z.string(),
  scoring_settings: z.any(),
  roster_positions: z.array(z.any()),
  previous_league_id: z.string(),
  name: z.string(),
  league_id: z.string(),
  draft_id: z.string(),
  avatar: z.string(),
});

export type TSleeperLeagueSchema = z.infer<typeof SleeperLeagueSchema>;

// --

export const SleeperLeagueUsersSchema = z.object({
  user_id: z.string(),
  username: z.string(),
  display_name: z.string(),
  avatar: z.string(),
  metadata: z.object({
    team_name: z.string(),
  }),
  is_owner: z.boolean(),
});

export type TSleeperLeagueUsersSchema = z.infer<
  typeof SleeperLeagueUsersSchema
>;

// --

export const LeagueTeamSchema = z.object({
  leagueId: z.string(),
  name: z.string(),
  user_display_name: z.string(),
});

export type TLeagueTeamSchema = z.infer<typeof LeagueTeamSchema>;

export type ExtendedLeagueTeamSchema = TLeagueTeamSchema & {
  _id: string;
  players: string[];
  createdAt: Date;
  updatedAt: Date;
};

// --

export const PlayerAddSchema = z.object({
  player_name: z.string(),
  position: z.string(),
});

export type TPlayerAddSchema = z.infer<typeof PlayerAddSchema>;

// --

export type TUserRosterInfo = {
  username: string;
  display_name: string;
  team_name: String;
};

// --
