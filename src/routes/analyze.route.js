import Fastify from "fastify";
// Controllers
import analyzeController from "../controllers/analyze.controller.js";

const analyzeRoutes = async (fastify = Fastify()) => {
  fastify.get(
    "/",
    {
      schema: {
        description: "get api detect smell types",
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
            repository: {
              type: "string",
              description: "URL of the repository",
            },
            hasTestSmell: {
              type: "boolean",
              description: "Boolean indicating the presence of a smell",
            },
          },
        },
        required: ["repository"],
      },
    },
    analyzeController.store
  );
};

export default analyzeRoutes;
