const axios = require("axios");
export default async (req, res) => {
  const response = await axios.post(
    process.env.NEXT_PUBLIC_API_URL + "/subscriptionDetails",
    req.body
  );
  res.status(200).json(response.data);
};
