import cookie from "cookie";
const axios = require("axios");

export default async (req, res) => {
  let data = req.body;
  await axios
    .post(process.env.NEXT_PUBLIC_API_URL + "/apiUser/authenticate", data)
    .then((response) => {
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", response.data.data.token.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 60 * 60 * 24 * 30,
          sameSite: "strict",
          path: "/",
        })
      );
      res.status(200).json({ login: true, data: response.data.data });
    })
    .catch((error) => {
      res.status(200).json({
        login: false,
        error: error,
        status: error.response.status,
      });
    });
};
