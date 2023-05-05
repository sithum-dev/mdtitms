const axios = require("axios");
export default async (req, res) => {
  const response = await axios.put(
    process.env.NEXT_PUBLIC_API_URL + "/offices?id=" + req.query.id,
    req.body.data
  );

  res.status(200).json(response.data);
};
