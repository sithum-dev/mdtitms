const axios = require("axios");
export default async (req, res) => {
  if (req.method === "GET") {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_URL +
        "/workoutPlan/byId?workoutPlanId=" +
        req.query.workoutId +
        "&subWorkoutPlanId=" +
        req.query.subWorkoutId
    );
    res.status(200).json(response.data);
  }
};
