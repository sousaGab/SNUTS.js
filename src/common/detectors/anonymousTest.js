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
          /it|test/.test(node.callee.name) &&
          astService.isFunction(args[1]) &&
          (!t.isIdentifier(args[0]) ||
            (t.isIdentifier(args[0]) && !/^\w+(\s\w+)?$/.test(args[0].name))) // Validation if has one or two words in regex
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
