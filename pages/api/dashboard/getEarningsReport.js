const axios = require("axios");
export default async (req, res) => {
  const response = await axios.post(
    process.env.NEXT_PUBLIC_API_URL +
      "/admin/earningsReport?start=" +
      req.body.start +
      "&limit=" +
      req.body.limit,
    {
      gte: req.body.gte,
      lte: req.body.lte,
      currencyType: req.body.currency,
    }
  );
  res.status(200).json(response.data);
};
