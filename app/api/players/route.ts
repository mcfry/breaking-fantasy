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
  const slug = request.nextUrl.searchParams.get("slug");

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
  } else if (slug) {
    // By slug (name)
    let player = await Player.findOne({ full_name: slug });
    return NextResponse.json(player);
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
