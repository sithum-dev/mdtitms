const axios = require("axios");
export default async (req, res) => {
  const response = await axios.post(
    process.env.NEXT_PUBLIC_API_URL +
      "/users/removePlanFromList/" +
      req.query.id +
      "?planId=" +
      req.query.planId
  );

  res.status(200).json(response.data);
};
