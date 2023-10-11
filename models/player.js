import mongoose, { Schema } from "mongoose";

// TODO: missing a few
const playerSchema = new Schema(
  {
    news_updated: {
      type: Number,
    },
    status: {
      type: String,
    },
    fantasy_data_id: {
      type: Number,
    },
    age: {
      type: Number,
    },
    gsis_id: {
      type: String,
    },
    position: {
      type: String,
    },
    number: {
      type: Number,
    },
    depth_chart_order: {
      type: Number,
    },
    high_school: {
      type: String,
    },
    search_last_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    first_name: {
      type: String,
    },
    yahoo_id: {
      type: Number,
    },
    player_id: {
      type: String,
    },
    college: {
      type: String,
    },
    swish_id: {
      type: Number,
    },
    rotowire_id: {
      type: Number,
    },
    weight: {
      type: String,
    },
    hashtag: {
      type: String,
    },
    search_full_name: {
      type: String,
    },
    sportradar_id: {
      type: String,
    },
    fantasy_positions: {
      type: [String],
    },
    stats_id: {
      type: Number,
    },
    sport: {
      type: String,
    },
    height: {
      type: String,
    },
    espn_id: {
      type: Number,
    },
    years_exp: {
      type: Number,
    },
    depth_chart_position: {
      type: String,
    },
    search_first_name: {
      type: String,
    },
    team: {
      type: String,
    },
    active: {
      type: Boolean,
    },
    search_rank: {
      type: Number,
    },
    birth_date: {
      type: String,
    },
    oddsjam_id: {
      type: String,
    },
    full_name: {
      type: String,
    },
  },
  {
    timestamps: false,
  }
);

const Player =
  mongoose.models.sleeperplayer ||
  mongoose.model("sleeperplayer", playerSchema);

export default Player;
