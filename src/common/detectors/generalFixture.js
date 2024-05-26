import traverse from "@babel/traverse";
import * as t from "@babel/types";
import astService from "../../services/ast.service.js";
const traverseDefault = traverse.default;

const detectGeneralFixture = (ast) => {
  const setupVariables = new Map(); // Using a Map for easier lookup
  const usedVariables = new Set();
  const generalFixtureSmells = [];

  const detectSetupVariables = (setupBody) => {
    if (t.isBlockStatement(setupBody)) {
      setupBody.body.forEach((statement) => {
        if (t.isVariableDeclaration(statement)) {
          statement.declarations.forEach((declaration) => {
            if (t.isIdentifier(declaration.id)) {
              setupVariables.set(declaration.id.name, {
                startLine: declaration.loc.start.line,
                endLine: declaration.loc.end.line,
              });
            }
          });
        }
      });
    }
  };

  traverseDefault(ast, {
    CallExpression(path) {
      const { callee, arguments: args } = path.node;

      if (
        t.isIdentifier(callee, { name: "beforeAll" }) ||
        t.isIdentifier(callee, { name: "beforeEach" })
      ) {
        if (args.length >= 1 && astService.isFunction(args[0])) {
          detectSetupVariables(args[0].body);
        }
      } else if (/^(it|test)$/.test(callee.name) && args.length >= 2) {
        const testBody = args[1].body;
        if (t.isBlockStatement(testBody)) {
          traverseDefault(testBody, {
            noScope: true,
            Identifier(innerPath) {
              if (setupVariables.has(innerPath.node.name)) {
                usedVariables.add({
                  name: innerPath.node.name,
                  loc: {
                    startLine: innerPath.node.loc.start.line,
                    endLine: innerPath.node.loc.end.line,
                  },
                });
              }
            },
          });
        }
      }
    },
  });

  setupVariables.forEach((_, variable) => {
    if (!usedVariables.has(variable)) {
      const { startLine, endLine } = setupVariables.get(variable);
      generalFixtureSmells.push({
        // ...variable,
        startLine,
        endLine,
      });
    }
  });

  return generalFixtureSmells;
};

export default detectGeneralFixture;
