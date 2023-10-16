import { NextRequest, NextResponse } from "next/server";

import connectMongo from "@/lib/mongodb";
import Player from "@/models/player";

type ShortenedPlayer = {
  team: string;
  full_name: string;
};

export async function GET(request: NextRequest) {
  await connectMongo();

  const id = request.nextUrl.searchParams.get("id");
  const ids = request.nextUrl.searchParams.get("ids");
  const search = request.nextUrl.searchParams.get("search");
  const position = request.nextUrl.searchParams.get("position");

  if (id) {
    // By ID
    let player = await Player.find({ player_id: id });
    return NextResponse.json(player);
  } else if (ids) {
    // By IDs
    let players = await Player.find(
      { player_id: { $in: ids.split(",") } },
      { full_name: 1, team: 1, player_id: 1 }
    );

    const playersObj: Record<number, ShortenedPlayer> = {};

    for (let player of players) {
      playersObj[player.player_id] = {
        team: player.team,
        full_name: player.full_name,
      };
    }

    return NextResponse.json(playersObj);
  } else if (search && position) {
    // By search (text index on full_name field)
    let players = await Player.aggregate([
      {
        $search: {
          index: "player_name",
          autocomplete: {
            path: "full_name",
            query: search,
            tokenOrder: "any",
            fuzzy: {
              maxEdits: 1,
              prefixLength: 1,
              maxExpansions: 256,
            },
          },
          highlight: {
            path: "full_name",
          },
        },
      },
      {
        $match: {
          position: position,
        },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          _id: 0,
          first_name: 1,
          last_name: 1,
          position: 1,
          highlights: {
            $meta: "searchHighlights",
          },
        },
      },
    ]);

    console.log(players);

    return NextResponse.json(players);
  } else {
    return NextResponse.json(
      {
        errors: "Must provide an ID or name",
      },
      {
        status: 400,
      }
    );
  }
}
