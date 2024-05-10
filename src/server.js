import { exec } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import { rimraf } from "rimraf";
import { glob } from "glob";
import parser from "@babel/parser";

import traverse from "@babel/traverse";
const traverseDefault = traverse.default;
import * as t from "@babel/types";

const detectControlLogic = (ast) => {
  const controlLogicSmells = [];
  traverseDefault(ast, {
    IfStatement(path) {
      controlLogicSmells.push(path);
    },
    SwitchStatement(path) {
      controlLogicSmells.push(path);
    },
    CallExpression(path) {
      const { callee } = path.node;
      if (
        t.isMemberExpression(callee) &&
        ((t.isIdentifier(callee.object, { name: "console" }) &&
          t.isIdentifier(callee.property, { name: "log" })) ||
          t.isIdentifier(callee.object, { name: "debug" }) ||
          t.isIdentifier(callee.object, { name: "halt" }))
      ) {
        controlLogicSmells.push(path);
      }
    },
  });
  return controlLogicSmells;
};

const detectAnonymousTest = (ast) => {
  const anonymousTestSmells = [];
  traverseDefault(ast, {
    CallExpression(path) {
      const { callee, arguments: args } = path.node;
      const isAnyTypeOfFunction =
        t.isFunctionExpression(args[1]) || t.isArrowFunctionExpression(args[1]);
      if (
        t.isIdentifier(callee, { name: "test" }) &&
        args.length >= 2 &&
        isAnyTypeOfFunction &&
        !t.isIdentifier(args[0])
      ) {
        anonymousTestSmells.push(path);
      }
    },
  });
  console.log("Anonymous", anonymousTestSmells);
  return anonymousTestSmells;
};

const detectSensitiveEquality = (ast) => {
  const sensitiveEqualitySmells = [];
  traverseDefault(ast, {
    CallExpression(path) {
      const { callee, arguments: args } = path.node;
      if (
        t.isMemberExpression(callee) &&
        t.isIdentifier(callee.property, { name: "toEqual" }) &&
        args.length === 1 &&
        t.isCallExpression(args[0]) &&
        t.isMemberExpression(args[0].callee) &&
        t.isIdentifier(args[0].callee.property, { name: "toString" })
      ) {
        sensitiveEqualitySmells.push(path);
      }
    },
    BinaryExpression(path) {
      const { left, right } = path.node;
      if (
        t.isCallExpression(left) &&
        t.isMemberExpression(left.callee) &&
        t.isMemberExpression(left.callee.object) &&
        t.isIdentifier(left.callee.object.property, { name: "toString" }) &&
        t.isCallExpression(right) &&
        t.isMemberExpression(right.callee) &&
        t.isMemberExpression(right.callee.object) &&
        t.isIdentifier(right.callee.object.property, { name: "toString" })
      ) {
        sensitiveEqualitySmells.push(path);
      }
    },
  });
  return sensitiveEqualitySmells;
};

let projectDir = "";

const parseFile = (file) => {
  const code = fs.readFileSync(file, "utf8");
  return parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });
};

const findTestFiles = async () => {
  const pattern = path.join(projectDir, "**/*.test.js");
  return await glob(pattern);
};

const getRepositoryName = (url) => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)(?:\/.*)?/;
  const match = url.match(regex);
  return match ? { userName: match[1], projectName: match[2] } : null;
};

const checkIfFolderExist = (path) => {
  return fs.existsSync(path);
};

const deleteDownloadRepositories = () => {
  return new Promise((resolve, reject) => {
    const __dirname = path.dirname("");
    const dir = path.resolve(__dirname, "public");
    const exist = checkIfFolderExist(dir);
    if (!exist) return reject(false);
    const result = rimraf(dir);
    resolve(result);
    console.log("Folder deleted successfully");
  });
};

const downloadRepository = (repoUrl) => {
  const __dirname = path.dirname("");
  const { userName, projectName } = getRepositoryName(repoUrl);
  const folder = `${userName}/${projectName}`;
  const dir = path.resolve(__dirname, "public", folder);
  projectDir = dir;
  return new Promise((resolve, reject) => {
    exec(`git clone ${repoUrl} ${dir}`, (err, stdout) => {
      if (err) return reject(err);
      resolve(stdout);
    });
  });
};

const main = async () => {
  try {
    await deleteDownloadRepositories();
    await downloadRepository("https://github.com/Jhonatanmizu/nasa_api");
    const files = await findTestFiles();

    const asts = [];
    files.forEach((file) => {
      const ast = parseFile(file);
      asts.push(ast);
    });

    const code = `
      test("", async () => {
          const isGreen = "isgreen";
          if (isGreen) {
            console.log("HADOUKEN");
          }
          console.log("HAKUNA MATA");
      });
  `;

    const code2 = `
  test('Check if user toString method returns correct value', () => {
    const user = new User('John', 30);

    // Sensitive Equality test smell: using toString directly in assertion
    expect(user.toString()).toEqual('John (30)');
});`;
    const parsedCode = parser.parse(code);

    detectControlLogic(parsedCode);
    detectSensitiveEquality(parsedCode);
  } catch (error) {
    console.error("Error", error);
  }
};

main();
