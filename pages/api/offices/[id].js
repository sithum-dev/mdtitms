const axios = require("axios");
export default async (req, res) => {
  const response = await axios.get(
    process.env.NEXT_PUBLIC_API_URL + "/offices/byId/" + req.query.id
  );

  res.status(200).json(response.data);
};
