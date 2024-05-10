import Fastify from "fastify";
// Controllers
import analyzeController from "../controllers/analyze.controller.js";

const analyzeRoutes = async (fastify = Fastify(), options) => {
  fastify.get(
    "/",
    {
      schema: {
        description: "get analyze",
        tags: ["analyze"],
      },
    },
    analyzeController.fetch
  );

  fastify.post(
    "/",
    {
      schema: {
        description: "post repository url",
        tags: ["analyze"],
        body: {
          type: "object",
          properties: {
            repository: { type: "string" },
          },
        },
      },
    },
    analyzeController.store
  );
};

export default analyzeRoutes;
