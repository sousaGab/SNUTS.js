import helpers from "../common/helpers/index.js";
import path from "node:path";
import {
  detectAnonymousTest,
  detectControlLogic,
  detectSensitiveEquality,
} from "../common/detectors/index.js";
class AnalyzeService {
  async handleAnalyze(repoUrl) {
    try {
      const __dirname = path.dirname("");
      const directory = path.resolve(__dirname, "./public");
      // const isDeleted = await helpers.deleteDownloadRepositories(directory);
      // if (!isDeleted) return;
      // await helpers.downloadRepository(repoUrl, directory);
      const testFiles = await helpers.findTestFiles(directory);
      const astFiles = testFiles.map((tf) => helpers.parseFile(tf));
      console.log("🚀 ~ AnalyzeService ~ handleAnalyze ~ astFiles:", astFiles);
      //   const result = [];
      //   const resultAnonymousTest = detectAnonymousTest(ast[0]);
      //   console.log(
      //     "🚀 ~ AnalyzeService ~ handleAnalyze ~ resultAnonymousTest:",
      //     resultAnonymousTest
      //   );
      //   const resultControlLogic = detectControlLogic(ast[0]);
      //   console.log(
      //     "🚀 ~ AnalyzeService ~ handleAnalyze ~ resultControlLogic:",
      //     resultControlLogic
      //   );
      //   const resultSensitiveEquality = detectSensitiveEquality(ast[0]);
      //   console.log(
      //     "🚀 ~ AnalyzeService ~ handleAnalyze ~ resultSensitiveEquality:",
      //     resultSensitiveEquality
      //   );
      //   return result;
    } catch (error) {
      console.error("Error when we tried to handle analyze", error);
    }
  }
}

const analyzeService = new AnalyzeService();
export default analyzeService;
