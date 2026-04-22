const { createAiRecommendation } = require("../services/recommendationService");

const createAiRecommendationController = async (req, res, next) => {
  try {
    const result = await createAiRecommendation({
      query: req.body?.query,
      limit: req.body?.limit,
    });

    res.json({ data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAiRecommendation: createAiRecommendationController,
};
