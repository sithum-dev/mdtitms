const axios = require("axios");
export default async (req, res) => {
  const response = await axios.put(
    process.env.NEXT_PUBLIC_API_URL +
      "/subscriptions/" +
      req.query.subId +
      "/updateBankSlipStatus?bankSlipLogId=" +
      req.query.logId,
    { paymentStatus: req.query.status }
  );
  res.status(200).json(response.data);
};
