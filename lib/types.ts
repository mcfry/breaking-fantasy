import { z } from "zod";

const validLeagueTypes = ["Manual", "Sleeper", "ESPN"];
export const LeagueSchema = z.object({
  name: z.string().min(4, {
    message: "League name must be at least 4 characters.",
  }),
  type: z.string().refine((val) => validLeagueTypes.includes(val), {
    message: "Invalid league type",
  }),
});

export type TLeagueSchema = z.infer<typeof LeagueSchema>;

export type ExtendedLeagueSchema = TLeagueSchema & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};
