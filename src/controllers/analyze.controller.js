import { detectors } from "../common/detectors/index.js";
import analyzeService from "../services/analyze.service.js";
class AnalyzeController {
  async fetch(request, reply) {
    const data = detectors.map((detector) =>
      detector.name.replace("detect", "")
    );
    reply.send({ data });
  }

  async store(request, reply) {
    const { repository, hasTestSmell } = request.body;
    try {
      const result = await analyzeService.handleAnalyze(repository);
      const filteredResult = hasTestSmell
        ? result.filter((re) => !!re.smells && re.smells.length > 0)
        : result;

      reply.send({ data: filteredResult });
    } catch (error) {
      console.error("error", error);
      reply
        .status(500)
        .send({ message: "Ocorreu um erro ao tentar analisar o repositório" });
    }
  }
}

const analyzeController = new AnalyzeController();

export default analyzeController;
