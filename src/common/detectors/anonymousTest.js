import traverse from "@babel/traverse";
import * as t from "@babel/types";
import astService from "../../services/ast.service.js";

const traverseDefault = traverse.default;

const detectAnonymousTest = (ast) => {
  const anonymousTestSmells = [];
  traverseDefault(ast, {
    CallExpression(path) {
      const { callee, arguments: args, loc } = path.node;
      if (args.length >= 2) {
        if (
          t.isIdentifier(callee, { name: "test" }) &&
          astService.isFunction(args[1]) &&
          !t.isIdentifier(args[0])
        ) {
          anonymousTestSmells.push({
            path,
            startLine: loc.start.line,
            endLine: loc.end.line,
          });
        }
      }
    },
  });
  return anonymousTestSmells;
};

export default detectAnonymousTest;
