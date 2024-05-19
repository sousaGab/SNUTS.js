import traverse from "@babel/traverse";
import * as t from "@babel/types";
import astService from "../../services/ast.service.js";

const traverseDefault = traverse.default;

const detectOvercommentedTest = (ast) => {
  const overcommentedTestSmells = [];
  traverseDefault(ast, {
    CallExpression(path) {
      const { callee, arguments: args, loc } = path.node;
      if (args.length >= 2) {
        if (
          t.isIdentifier(callee, { name: "test" }) &&
          astService.isFunction(args[1]) &&
          astService.hasManyComments(args[1], 5) // Check if the test function has more than 5 comments
        ) {
          overcommentedTestSmells.push({
            path,
            startLine: loc.start.line,
            endLine: loc.end.line,
          });
        }
      }
    },
  });
  return overcommentedTestSmells;
};

export default detectOvercommentedTest;
