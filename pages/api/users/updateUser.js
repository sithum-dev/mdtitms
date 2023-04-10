const axios = require("axios");
export default async (req, res) => {
  const response = await axios.put(
    process.env.NEXT_PUBLIC_API_URL + "/users?userId=" + req.query.uid,
    req.body
  );

  res.status(200).json(response.data);
};
