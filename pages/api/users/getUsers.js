const axios = require("axios");
export default async (req, res) => {
  const tags = req.body.tags;
  const order = req.body.order;
  const response = await axios.post(
    process.env.NEXT_PUBLIC_API_URL +
      "/users/search?pageSize=" +
      req.query.pageSize +
      "&pageNo=" +
      req.query.pageNumber +
      "&query=" +
      req.query.query,
    { tagIdList: tags, order: order }
  );

  res.status(200).json(response.data);
};
