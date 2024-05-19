import helpers from "../common/helpers/index.js";
import path from "node:path";
import { detectors } from "../common/detectors/index.js";
import astService from "./ast.service.js";
class AnalyzeService {
  async handleAnalyze(repoUrl) {
    try {
      const __dirname = path.dirname("");
      const directory = path.resolve(__dirname, "./public");
      // await helpers.deleteDownloadRepositories(directory);
      // await helpers.downloadRepository(repoUrl, directory);
      const testFiles = await helpers.findTestFiles(directory);
      const astFiles = testFiles.map((tf) => {
        const testAst = astService.parseToAst(tf);
        const smells = detectors.map((detector) => detector(testAst));
        return detectors.map((detector) => {
          return {
            file: tf,
            type: detector.name.replace("detect", ""),
            smells: detector(testAst).length,
            info: astService.getTestInfo(testAst),
          };
        });
      });
      // const result = [];
      // astFiles.forEach((ast) => {
      //   detectors.forEach((detector) => {
      //     const smells = detector(ast);
      //     result.push({ smell: detector.name, smells });
      //   });
      // });
      return astFiles;
    } catch (error) {
      console.error("Error when we tried to handle analyze", error);
    }
  }
}

const analyzeService = new AnalyzeService();
export default analyzeService;
