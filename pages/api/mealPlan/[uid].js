const axios = require("axios");
export default async (req, res) => {
  if (req.method === "POST") {
    //Crate new workout paln
    if (!req.body.mealPlanId) {
      const data = {
        userId: req.body.userId,
        instructions: "test instructions",
        mealPlans: {
          assignedDate: Date.now(),
          content: req.body.mealPlansData,
          saveAsTemplate: req.body.saveAsTemplate,
          templateName: req.body.templateName,
        },
      };

      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/dietPlan",
        data
      );

      res.status(200).json(response.data);
    } else {
      const data = {
        dietPlanId: req.body.mealPlanId,
        subDietPlanId: req.body.subMealPlanId,
        assignedDate: Date.now(),
        content: req.body.mealPlansData,
        saveAsTemplate: req.body.saveAsTemplate,
        templateName: req.body.templateName,
      };

      const response = await axios.put(
        process.env.NEXT_PUBLIC_API_URL + "/dietPlan/dietPlansArray",
        data
      );

      res.status(200).json(response.data);
    }
  } else if (req.method === "GET") {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "/dietPlan?userId=" + req.query.uid
    );
    res.status(200).json(response.data);
  } else if (req.method === "DELETE") {
    const response = await axios.delete(
      process.env.NEXT_PUBLIC_API_URL +
        "/dietPlan?dietPlanId=" +
        req.query.dietPlanId +
        "&subDietPlanId=" +
        req.query.subDietPlanId
    );

    res.status(200).json(response.data);
  }
};
