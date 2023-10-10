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
  },
  {
    timestamps: true,
  }
);

const League = mongoose.models.League || mongoose.model("League", leagueSchema);

export default League;
