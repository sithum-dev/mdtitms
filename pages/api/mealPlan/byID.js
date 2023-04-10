const axios = require("axios");
export default async (req, res) => {
  if (req.method === "GET") {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_URL +
        "/dietPlan/byId?dietPlanId=" +
        req.query.dietPlanId +
        "&subDietPlanId=" +
        req.query.subDietPlanId
    );
    res.status(200).json(response.data);
  }
};
