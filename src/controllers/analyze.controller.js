import analyzeService from "../services/analyze.service.js";

class AnalyzeController {
  async fetch(request, reply) {
    reply.send({ hello: "world" });
  }

  async store(request, reply) {
    const { repository } = request.body;
    const result = await analyzeService.handleAnalyze(repository);
    reply.send({ message: "stored", result });
  }
}

const analyzeController = new AnalyzeController();

export default analyzeController;
