import traverse from "@babel/traverse";
const traverseDefault = traverse.default;
import * as t from "@babel/types";
import parser from "@babel/parser";
import fs from "node:fs";

const defaultPlugins = [
  "classProperties",
  "dynamicImport",
  "decorators",
  "jsx",
  "partialApplication",
  "exportDefaultFrom",
  ["pipelineOperator", { proposal: "minimal" }],
  "@babel/plugin-proposal-do-expressions",
  "@babel/plugin-proposal-destructuring-private",
  "@babel/plugin-syntax-import-assertions",
];

const configsTypescript = {
  sourceType: "module",
  plugins: ["typescript", ...defaultPlugins],
  errorRecovery: true,
};

const configsFlow = {
  sourceType: "module",
  plugins: ["flow", ...defaultPlugins],
  errorRecovery: true,
};

const jestSuiteAliases = ["describe"];
const jestTestAliases = ["it", "test"];

class AstService {
  getTestInfo(ast) {
    return {
      itCount: 1,
      describeCount: 1,
    };
  }

  getDescribeCount(ast) {
    let describeCount = 0;
    traverseDefault(ast, {
      CallExpression: ({ node }) => {
        if (node.callee.name === "describe") {
          describeCount++;
        }
      },
    });
    return describeCount;
  }

  getItCount(ast) {
    let itCount = 0;
    traverseDefault(ast, {
      CallExpression: ({ node }) => {
        if (this.isTestCase(node) && /it|test/g.test(node.callee.name)) {
          itCount++;
        }
      },
    });
  }

  getTestNodeAst(code) {
    const ast = this.parseToAst(code);
    let testNode;
    traverseDefault(ast, {
      CallExpression(path) {
        if (jestSuiteAliases.includes(path.node.callee.name)) {
          path.traverse({
            CallExpression(describePath) {
              if (jestTestAliases.includes(describePath.node.callee.name)) {
                testNode = describePath;
              }
            },
          });
        } else if (jestSuiteAliases.includes(path.node.callee.name)) {
          testNode = path;
        }
      },
    });
    return testNode;
  }

  parseToAst(file) {
    const code = fs.readFileSync(file, "utf8");
    try {
      return parser.parse(code, configsFlow);
    } catch (error) {
      return parser.parse(code, configsTypescript);
    }
  }

  isSetupMethod(node) {
    const setupMethods = ["beforeEach", "beforeAll", "afterEach", "afterAll"];
    return (
      t.isIdentifier(node.callee) &&
      setupMethods.includes(node.callee.name) &&
      this.isFunction(node.arguments[0])
    );
  }

  isFunction(node) {
    return (
      types.isArrowFunctionExpression(node) || types.isFunctionExpression(node)
    );
  }

  isTestCase(node) {
    const testCaseCallee = ["it", "test"];
    return (
      types.isIdentifier(node.callee) &&
      testCaseCallee.includes(node.callee.name) &&
      types.isStringLiteral(node.arguments[0]) &&
      this.isFunction(node.arguments[1])
    );
  }

  isAssert(node) {
    const assertMethods = ["expect", "assert"];
    try {
      return (
        t.isExpressionStatement(node) &&
        t.isCallExpression(node?.expression) &&
        t.isMemberExpression(node?.expression.callee) &&
        assertMethods.includes(
          node?.expression.callee.name ||
            node?.expression?.callee?.object?.callee?.name
        )
      );
    } catch (error) {
      console.error(err);
      let { end, start } = node.loc;
      console.table(start.line, end.line);
      throw err;
    }
  }
}

const astService = new AstService();

export default astService;
