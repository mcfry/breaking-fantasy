import { NextRequest, NextResponse } from "next/server";

import connectMongo from "@/lib/mongodb";
import League from "@/models/league";

import { LeagueSchema, TLeagueSchema, ExtendedLeagueSchema } from "@/lib/types";

export async function GET(request: NextRequest) {
  await connectMongo();

  const id = request.nextUrl.searchParams.get("id");
  const slug = request.nextUrl.searchParams.get("slug");

  if (id) {
    // By ID
    let league = await League.findById(id);
    return NextResponse.json(league);
  } else if (slug) {
    // By slug (name)
    let league = await League.findOne({ name: slug });
    return NextResponse.json(league);
  } else {
    // ALL
    let leagues = await League.find();
    return NextResponse.json({ leagues });
  }
}

export async function POST(request: NextRequest) {
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

export async function PATCH(request: NextRequest) {
  const body: ExtendedLeagueSchema = await request.json();
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
      const updatedLeague = await League.updateOne({ _id: body._id }, body);

      return NextResponse.json(
        {
          message: "League Updated",
          data: updatedLeague,
        },
        {
          status: 200,
        }
      );
    } catch (e) {
      return NextResponse.json(
        {
          errors: "Error updating league",
        },
        {
          status: 500,
        }
      );
    }
  }
}

export async function DELETE(request: NextRequest) {
  await connectMongo();

  const id = request.nextUrl.searchParams.get("id");

  if (id) {
    try {
      let deletedCount = await League.deleteOne({ _id: id });
      return NextResponse.json(deletedCount);
    } catch (e) {
      return NextResponse.json(
        {
          errors: "Error deleting league",
        },
        {
          status: 500,
        }
      );
    }
  } else {
    return NextResponse.json(
      {
        errors: "No ID provided",
      },
      {
        status: 400,
      }
    );
  }
}
