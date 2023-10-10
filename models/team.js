import mongoose, { Schema } from "mongoose";

const teamSchema = new Schema(
  {
    leagueId: {
      type: String,
      required: true,
    },
    playerId: {
      type: String,
      required: true,
    },
    players: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Team = mongoose.models.Team || mongoose.model("Team", teamSchema);

export default Team;
