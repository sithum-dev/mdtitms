const axios = require("axios");
export default async (req, res) => {
  const response = await axios.post(
    process.env.NEXT_PUBLIC_API_URL + "/admin/subscriptionGraph",
    {
      gte: req.body.gte,
      lte: req.body.lte,
    }
  );
  res.status(200).json(response.data);
};
