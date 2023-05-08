const axios = require("axios");
export default async (req, res) => {
  const response = await axios.post(
    process.env.NEXT_PUBLIC_API_URL +
      "/users/search?pageSize=" +
      req.query.pageSize +
      "&pageNo=" +
      req.query.pageNumber +
      "&query=" +
      req.query.query +
      "&officeId=" +
      req.query.officeId
  );

  res.status(200).json(response.data);
};
