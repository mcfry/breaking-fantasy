import axios from "axios";

const getLeagues = async (userId) => {
  const response = await axios.get(`https://api.sleeper.app/v1/user/${userId}`);
  const response2 = await axios.get(
    `https://api.sleeper.app/v1/user/${response.data.user_id}/leagues/nfl/2023`
  );

  return await response2.data;
};

// const userParse = username.safeParse(usernameRef.current?.value);
//       if (userParse.success === true) {
//         fetch(`https://api.sleeper.app/v1/user/${usernameRef.current?.value}`, {
//           method: "GET",
//         })
//           .then((res) => res.json())
//           .then((data) => {
//             if (data) {
//               setUserIdSearched(data.user_id);

//               fetch(
//                 `https://api.sleeper.app/v1/user/${data.user_id}/leagues/nfl/2023`,
//                 {
//                   method: "GET",
//                 }
//               )
//                 .then((res) => res.json())
//                 .then((data) => {
//                   if (data) {
//                     console.log(data);
//                     setSleeperLeagues(data);
//                   }
//                 });
//             }
//           });
//       }

// fetch(`https://api.sleeper.app/v1/league/${selectValue}/rosters`, {
//     method: "GET",
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       if (data) setSleeperRosters(data);
//     });

//   fetch(`https://api.sleeper.app/v1/league/${selectValue}/users`, {
//     method: "GET",
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       if (data) setSleeperUsers(data);
//     });

const getRosters = async (leagueId) => {
  const response = await axios.get(
    `https://api.sleeper.app/v1/league/${leagueId}/rosters`
  );
  return response.data;
};

const getUsers = async (leagueId) => {
  const response = await axios.get(
    `https://api.sleeper.app/v1/league/${leagueId}/users`
  );
  return response.data;
};

export { getLeagues, getRosters, getUsers };
