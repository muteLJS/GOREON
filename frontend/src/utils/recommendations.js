import api from "@/utils/api";

export const fetchAiRecommendations = async ({ query, limit = 3, signal }) => {
  const response = await api.post("/recommendations/ai", { query, limit }, { signal });

  return response.data.data;
};
