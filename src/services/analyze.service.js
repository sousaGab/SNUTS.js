import helpers from "../common/helpers/index.js";
import path from "node:path";
import { detectors } from "../common/detectors/index.js";
import astService from "./ast.service.js";
class AnalyzeService {
  async handleAnalyze(repoUrl) {
    try {
      const __dirname = path.dirname("");
      const directory = path.resolve(__dirname, "./public");
      await helpers.deleteDownloadRepositories(directory);
      const repoFolder = helpers.getRepositoryFolder(repoUrl);
      await helpers.downloadRepository(repoUrl, repoFolder);
      const testFiles = await helpers.findTestFiles(directory);

      const astFiles = testFiles.map((tf) => {
        const testAst = astService.parseToAst(tf);
        return detectors.map((detector) => {
          return {
            file: tf,
            type: detector.name.replace("detect", ""),
            smells: detector(testAst),
            info: astService.getTestInfo(testAst),
          };
        });
      });
      return astFiles;
    } catch (error) {
      console.error("Error when we tried to handle analyze", error);
      return [];
    }
  }
}

const analyzeService = new AnalyzeService();
export default analyzeService;
