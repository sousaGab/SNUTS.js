import traverse from "@babel/traverse";
import * as t from "@babel/types";
import astService from "../../services/ast.service.js";

const traverseDefault = traverse.default;

const detectGeneralFixture = (ast) => {
  const setupVariables = new Set();
  const usedVariables = new Set();
  const generalFixtureSmells = [];

  traverseDefault(ast, {
    CallExpression(path) {
      const { callee, arguments: args } = path.node;
      if (
        t.isIdentifier(callee, { name: "beforeAll" }) ||
        t.isIdentifier(callee, { name: "beforeEach" })
      ) {
        if (args.length >= 1 && astService.isFunction(args[0])) {
          const setupBody = args[0].body;
          if (t.isBlockStatement(setupBody)) {
            setupBody.body.forEach((statement) => {
              if (t.isVariableDeclaration(statement)) {
                statement.declarations.forEach((declaration) => {
                  if (t.isIdentifier(declaration.id)) {
                    setupVariables.add(declaration.id.name);
                  }
                });
              }
            });
          }
        }
      } else if (t.isIdentifier(callee, { name: "test" }) && args.length >= 2) {
        const testBody = args[1].body;
        if (t.isBlockStatement(testBody)) {
          traverseDefault(testBody, {
            Identifier(innerPath) {
              if (setupVariables.has(innerPath.node.name)) {
                usedVariables.add(innerPath.node.name);
              }
            },
          });
        }
      }
    },
  });

  setupVariables.forEach((variable) => {
    if (!usedVariables.has(variable)) {
      generalFixtureSmells.push(variable);
    }
  });

  return generalFixtureSmells;
};

export default detectGeneralFixture;
