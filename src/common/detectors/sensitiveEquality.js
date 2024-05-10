import traverse from "@babel/traverse";
import * as t from "@babel/types";

const traverseDefault = traverse.default;

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

export default detectSensitiveEquality;
