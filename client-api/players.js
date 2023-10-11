import axios from "axios";

const getPlayers = async (playerIds) => {
  const response = await axios.get(
    `http://localhost:3000/api/players?ids=${playerIds}`
  );

  return response.data;
};

export { getPlayers };
