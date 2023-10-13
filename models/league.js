import mongoose, { Schema } from "mongoose";

// Custom Validators
const validateType = (value) => {
  const validTypes = ["Manual", "Sleeper", "ESPN"];
  return validTypes.includes(value);
};

const leagueSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
      validate: [validateType, "Invalid league type"],
    },
    leagueId: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const League = mongoose.models.league || mongoose.model("league", leagueSchema);

export default League;
