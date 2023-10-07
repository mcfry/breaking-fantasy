import { NextResponse } from "next/server";

import connectMongo from "@/lib/mongodb";
import League from "@/models/league";

import { LeagueSchema, TLeagueSchema } from "@/lib/types";

export async function POST(request: Request) {
  const body: TLeagueSchema = await request.json();
  await connectMongo();

  const result = LeagueSchema.safeParse(body);
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
      const createdLeague = await League.create(body);

      return NextResponse.json(
        {
          message: "League Created",
          data: createdLeague,
        },
        {
          status: 201,
        }
      );
    } catch (e) {
      return NextResponse.json(
        {
          errors: "Error creating league",
        },
        {
          status: 500,
        }
      );
    }
  }
}

export async function GET() {
  await connectMongo();

  const leagues = await League.find();

  return NextResponse.json({ leagues });
}
