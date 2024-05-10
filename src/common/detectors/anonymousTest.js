import traverse from "@babel/traverse";
import * as t from "@babel/types";

const traverseDefault = traverse.default;

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
  return anonymousTestSmells;
};

export default detectAnonymousTest;
