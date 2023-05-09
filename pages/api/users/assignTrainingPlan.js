const axios = require("axios");
export default async (req, res) => {
  const response = await axios.post(
    process.env.NEXT_PUBLIC_API_URL + "/users/updatePlansList/" + req.query.id,
    req.body
  );

  res.status(200).json(response.data);
};
