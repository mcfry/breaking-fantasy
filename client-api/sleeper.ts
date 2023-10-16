import axios from "axios";

import {
  TSleeperLeagueSchema,
  TSleeperRosterSchema,
  TSleeperLeagueUsersSchema,
  TUserRosterInfo,
} from "@/lib/types";

const getLeagues = async (
  userId: string | undefined
): Promise<TSleeperLeagueSchema[]> => {
  const response = await axios.get(`https://api.sleeper.app/v1/user/${userId}`);
  const response2 = await axios.get(
    `https://api.sleeper.app/v1/user/${response.data.user_id}/leagues/nfl/2023`
  );

  return await response2.data;
};

const getRosters = async (
  leagueId: string
): Promise<TSleeperRosterSchema[]> => {
  const response = await axios.get(
    `https://api.sleeper.app/v1/league/${leagueId}/rosters`
  );
  return response.data;
};

const getUsers = async (
  leagueId: string
): Promise<Record<string, TUserRosterInfo>> => {
  const response = await axios.get(
    `https://api.sleeper.app/v1/league/${leagueId}/users`
  );
  const sleeperLeagueUsers: TSleeperLeagueUsersSchema[] = response.data;

  const usersObj: Record<string, TUserRosterInfo> = {};
  for (let user of sleeperLeagueUsers) {
    usersObj[user.user_id] = {
      username: user.username,
      display_name: user.display_name,
      team_name: user.metadata.team_name,
    };
  }

  return usersObj;
};

export { getLeagues, getRosters, getUsers };
