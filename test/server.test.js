import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { server } from "../src/server.js";

const host = process.env.HOST;
const port = process.env.PORT;

describe("Server", () => {
  beforeAll(async () => {
    await server.listen({ host, port });
  });

  afterAll(async () => {
    await server.close();
  });

  it("should return pong for GET/ping", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/ping",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ message: "pong" });
  });

  it("should return ok for GET/health", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/health",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "ok" });
  });
});
