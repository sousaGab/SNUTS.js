import { glob } from "glob";
import { exec } from "node:child_process";
import fs from "node:fs";
import { rimraf } from "rimraf";
import path from "node:path";
import parser from "@babel/parser";
import process from "node:process";
const isWin = process.platform === "win32";

const TEST_FILE_PATTERNS = [
  "**/*.test.js",
  "**/*.tests.js",
  "**/*.spec.js",
  "**/*.specs.js",
  "**/*test_*.js",
  "**/*test-*.js",
  "**/*Spec*.js",
];

class Helpers {
  checkIfFolderExist(path) {
    return fs.existsSync(path);
  }

  getRepositoryName(url) {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)(?:\/.*)?/;
    const match = url.match(regex);
    return match ? { userName: match[1], projectName: match[2] } : null;
  }
  getRepositoryFolder(repoUrl) {
    const __dirname = path.dirname("");
    const { userName, projectName } = this.getRepositoryName(repoUrl);
    const folder = `${userName}/${projectName}`;
    const dir = path.resolve(__dirname, "public", folder);
    return dir;
  }
  async deleteDownloadRepositories(directory) {
    const exist = this.checkIfFolderExist(directory);
    if (!exist) return;
    return await rimraf(directory);
  }

  downloadRepository(repoUrl, directory) {
    return new Promise((resolve, reject) => {
      exec(`git clone ${repoUrl} ${directory}`, (err, stdout) => {
        if (err) return reject(err);
        resolve(stdout);
      });
    });
  }

  async findTestFiles(directory) {
    const options = {
      ignore: "node_modules",
      cwd: directory,
      windowsPathsNoEscape: isWin,
      absolute: true,
      nodir: true,
    };
    const testFiles = await Promise.all(
      TEST_FILE_PATTERNS.map((pattern) => glob(pattern, options))
    );

    return testFiles.flat();
  }

  parseFile(file) {
    const code = fs.readFileSync(file, "utf8");
    return parser.parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });
  }
}

const helpers = new Helpers();

export default helpers;
