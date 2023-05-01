const axios = require("axios");
export default async (req, res) => {
  const response = await axios.get(
    process.env.NEXT_PUBLIC_API_URL + "/recipes/videoDetails"
  );
  res.status(200).json(response.data);
};