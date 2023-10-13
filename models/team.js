import mongoose, { Schema } from "mongoose";

const teamSchema = new Schema(
  {
    leagueId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    user_display_name: {
      type: String,
      required: true,
    },
    players: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const Team = mongoose.models.team || mongoose.model("team", teamSchema);

export default Team;
