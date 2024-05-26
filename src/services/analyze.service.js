import helpers from "../common/helpers/index.js";
import path from "node:path";
import { detectors } from "../common/detectors/index.js";
import astService from "./ast.service.js";

class AnalyzeService {
  async handleAnalyze(repoUrl) {
    try {
      const __dirname = path.dirname("");
      const directory = path.resolve(__dirname, "./public");
      const repoFolder = helpers.getRepositoryFolder(repoUrl);
      await helpers.downloadRepository(repoUrl, repoFolder);
      const testFiles = await helpers.findTestFiles(directory);
      const astFiles = testFiles.map((tf) => {
        const testAst = astService.parseToAst(tf);
        const testInfo = astService.getTestInfo(testAst);
        return detectors.map((detector) => {
          return {
            file: tf,
            type: detector.name.replace("detect", ""),
            smells: detector(testAst),
            info: testInfo,
          };
        });
      });
      await helpers.deleteDownloadRepositories(directory);
      return astFiles.flat();
    } catch (error) {
      console.error("Error when we tried to handle analyze", error);
      return [];
    }
  }
  async handleAnalyzeToCSV(repoUrl) {
    try {
      const __dirname = path.dirname("");
      const directory = path.resolve(__dirname, "./public");
      const repoFolder = helpers.getRepositoryFolder(repoUrl);
      await helpers.downloadRepository(repoUrl, repoFolder);
      const testFiles = await helpers.findTestFiles(directory);
      const astFiles = testFiles.map((tf) => {
        const testAst = astService.parseToAst(tf);
        const testInfo = astService.getTestInfo(testAst);
        return detectors.map((detector) => {
          return {
            file: helpers.getPathAfterPublic(tf),
            type: detector.name.replace("detect", ""),
            smells: detector(testAst),
            itCount: testInfo.itCount,
            describeCount: testInfo.describeCount,
          };
        });
      });
      await helpers.deleteDownloadRepositories(directory);
      return astFiles.flat();
    } catch (error) {
      console.error("Error when we tried to handle analyze to csv", error);
      return [];
    }
  }
}

const analyzeService = new AnalyzeService();
export default analyzeService;
