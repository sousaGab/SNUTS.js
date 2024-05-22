import Fastify from "fastify";
import { configDotenv } from "dotenv";
import analyzeRoutes from "./routes/analyze.route.js";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
configDotenv();

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

fastify.register(swagger, {
  openapi: {
    openapi: "3.0.0",
    info: {
      title: "Test Smell.js Detector API",
      description:
        "This API can detect test smells in javascript repositories.",
      version: "0.1.0",
    },
    tags: [
      { name: "analyze", description: "Analyze related end-points" },
      { name: "code", description: "Code related end-points" },
    ],

    externalDocs: {
      url: "https://swagger.io",
      description: "Find more info here",
    },
    apis: ["./routes/*.js"],
  },
});

fastify.register(swaggerUi, {
  routePrefix: "/documentation",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject) => {
    return swaggerObject;
  },
  transformSpecificationClone: true,
});

fastify.register(helmet);
fastify.register(cors, {
  origin: "*",
});

fastify.register(analyzeRoutes);

fastify.get("/ping", function (request, reply) {
  reply.send({ message: "pong" });
});

const handleStartServer = async () => {
  return await fastify.listen({ host, port }, (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    console.log(`Server is now listening on http://localhost:${address}`);
  });
};

handleStartServer();
