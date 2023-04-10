const axios = require("axios");
export default async (req, res) => {
  if (req.method === "POST") {
    //Crate new workout paln
    if (!req.body.workoutPlanId) {
      const data = {
        userId: req.body.userId,
        instructions: "test instructions",
        workoutPlans: {
          assignedDate: Date.now(),
          content: req.body.workoutPlansData,
          saveAsTemplate: req.body.saveAsTemplate,
          templateName: req.body.templateName,
        },
      };

      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/workoutPlan",
        data
      );

      res.status(200).json(response.data);
    } else {
      const data = {
        workoutPlanId: req.body.workoutPlanId,
        subWorkoutPlanId: req.body.subWorkoutPlanId,
        assignedDate: Date.now(),
        content: req.body.workoutPlansData,
        saveAsTemplate: req.body.saveAsTemplate,
        templateName: req.body.templateName,
      };

      const response = await axios.put(
        process.env.NEXT_PUBLIC_API_URL + "/workoutPlan/workoutPlansArray",
        data
      );

      res.status(200).json(response.data);
    }
  } else if (req.method === "GET") {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "/workoutPlan?userId=" + req.query.uid
    );
    res.status(200).json(response.data);
  } else if (req.method === "DELETE") {
    const response = await axios.delete(
      process.env.NEXT_PUBLIC_API_URL +
        "/workoutPlan?workoutPlanId=" +
        req.query.workoutId +
        "&subWorkoutPlanId=" +
        req.query.subWorkoutId
    );

    res.status(200).json(response.data);
  }
};
