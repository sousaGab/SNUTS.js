import fs from "node:fs";
import { rimraf } from "rimraf";

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
  getRepositoryFolder() {
    const __dirname = path.dirname("");
    const { userName, projectName } = this.getRepositoryName(repoUrl);
    const folder = `${userName}/${projectName}`;
    const dir = path.resolve(__dirname, "public", folder);
    return dir;
  }
  deleteDownloadRepositories(directory = "") {
    return new Promise(async (resolve, reject) => {
      const exist = this.checkIfFolderExist(directory);
      if (!exist) return reject(false);
      const result = await rimraf(directory);
      resolve(result);
    });
  }

  downloadRepository(repoUrl, directory) {
    return new Promise((resolve, reject) => {
      exec(`git clone ${repoUrl} ${directory}`, (err, stdout) => {
        if (err) return reject(err);
        resolve(stdout);
      });
    });
  }
}
