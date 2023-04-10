const axios = require("axios");
export default async (req, res) => {
  const response = await axios.post(
    process.env.NEXT_PUBLIC_API_URL +
      "/admin/subscriptionReport?start=" +
      req.body.start +
      "&limit=" +
      req.body.limit,
    {
      gte: req.body.gte,
      lte: req.body.lte,
      //   gte: "2021-05-05",
      //   lte: "2022-09-05",
    }
  );
  res.status(200).json(response.data);
};
