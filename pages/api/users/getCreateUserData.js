const axios = require("axios");
export default async (req, res) => {
  const scalesData = await axios.get(
    process.env.NEXT_PUBLIC_API_URL + "/usersScale"
  );

  const serviesData = await axios.get(
    process.env.NEXT_PUBLIC_API_URL + "/userServices"
  );

  const postsData = await axios.get(
    process.env.NEXT_PUBLIC_API_URL + "/usersPost"
  );

  res
    .status(200)
    .json({
      scales: scalesData?.data,
      servies: serviesData?.data,
      posts: postsData?.data,
    });
};
