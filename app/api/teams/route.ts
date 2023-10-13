import { NextRequest, NextResponse } from "next/server";

import connectMongo from "@/lib/mongodb";
import Team from "@/models/team";

import {
  LeagueTeamSchema,
  TLeagueTeamSchema,
  ExtendedLeagueTeamSchema,
} from "@/lib/types";

export async function POST(request: NextRequest) {
  const body: TLeagueTeamSchema = await request.json();
  await connectMongo();

  const result = LeagueTeamSchema.safeParse(body);
  let zodErrors = {};
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });

    return NextResponse.json({
      errors: zodErrors,
    });
  } else {
    try {
      const createdTeam = await Team.create(body);

      return NextResponse.json(
        {
          message: "Team Created",
          data: createdTeam,
        },
        {
          status: 201,
        }
      );
    } catch (e) {
      return NextResponse.json(
        {
          errors: "Error creating team",
        },
        {
          status: 500,
        }
      );
    }
  }
}

export async function PATCH(request: NextRequest) {
  const body: ExtendedLeagueTeamSchema = await request.json();
  await connectMongo();

  const result = LeagueTeamSchema.safeParse(body);
  let zodErrors = {};
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });

    return NextResponse.json({
      errors: zodErrors,
    });
  } else {
    try {
      const updatedTeam = await Team.updateOne({ _id: body._id }, body);

      return NextResponse.json(
        {
          message: "Team Updated",
          data: updatedTeam,
        },
        {
          status: 200,
        }
      );
    } catch (e) {
      return NextResponse.json(
        {
          errors: "Error updating team",
        },
        {
          status: 500,
        }
      );
    }
  }
}
