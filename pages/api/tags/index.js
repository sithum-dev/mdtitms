const axios = require("axios");
export default async (req, res) => {
  if (req.method === "GET") {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "/tags/?tagCategory=" + req.query.type
    );
    res.status(200).json(response.data);
  } else if (req.method === "POST") {
    const response = await axios.put(
      process.env.NEXT_PUBLIC_API_URL +
        "/users/updateUserTags?id=" +
        req.query.uid,
      req.body
    );

    res.status(200).json(response.data);
  }
};
