import traverse from "@babel/traverse";
import * as t from "@babel/types";
import astService from "../../services/ast.service.js";

const traverseDefault = traverse.default;

const detectTestWithoutDescription = (ast) => {
  const testsWithoutDescription = [];
  traverseDefault(ast, {
    CallExpression(path) {
      const { callee, arguments: args, loc } = path.node;
      if (/^(it|test)$/.test(callee.name) && args.length >= 2) {
        const isAnyTypeOfFunction = astService.isFunction(args[1]);
        if (
          isAnyTypeOfFunction &&
          t.isStringLiteral(args[0]) &&
          args[0].value.trim() === ""
        ) {
          testsWithoutDescription.push({
            startLine: loc.start.line,
            endLine: loc.end.line,
          });
        }
      }
    },
  });
  return testsWithoutDescription;
};

export default detectTestWithoutDescription;
