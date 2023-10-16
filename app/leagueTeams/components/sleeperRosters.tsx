import { removeStarters } from "@/lib/utils";
import { TSleeperRosterSchema, TUserRosterInfo } from "@/lib/types";

export function SleeperRosters({
  rosters,
  users,
  players,
}: {
  rosters: TSleeperRosterSchema[];
  users: Record<string, TUserRosterInfo>;
  players: any;
}) {
  return (
    <>
      {rosters?.map((roster: TSleeperRosterSchema) => {
        const removedStarterZeros = roster.starters.filter(
          (item: string) => item !== "0"
        );

        const removedPlayerZeros = roster.players.filter(
          (item: string) => item !== "0"
        );

        return (
          <div key={roster.owner_id} className="flex flex-col space-y-2">
            <div className="flex flex-col items-center justify-center">
              <span className="scroll-m-20 text-2xl font-semibold tracking-tight">
                &nbsp;
                {users && users[roster.owner_id].display_name}
                &nbsp;
              </span>
              <span className="scroll-m-20 font-semibold tracking-tight">
                &nbsp;
                {users && users[roster.owner_id].team_name}
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
                      {players[starter].full_name || players[starter].team}
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
                      {players[benched].full_name || players[benched].team}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </>
  );
}
