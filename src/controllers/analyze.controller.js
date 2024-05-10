class AnalyzeController {
  async fetch(request, reply) {
    reply.send({ hello: "world" });
  }

  async store(request, reply) {
    const { repository } = request.body;
    reply.send({ message: "stored" });
  }
}

const analyzeController = new AnalyzeController();

export default analyzeController;
