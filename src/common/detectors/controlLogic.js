import traverse from "@babel/traverse";
import * as t from "@babel/types";

const traverseDefault = traverse.default;

const detectControlLogic = (ast) => {
  const controlLogicTestSmells = [];
  traverseDefault(ast, {
    IfStatement(path) {
      controlLogicTestSmells.push(path);
    },
    SwitchStatement(path) {
      controlLogicTestSmells.push(path);
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
        controlLogicTestSmells.push(path);
      }
    },
  });
  return controlLogicTestSmells;
};
export default detectControlLogic;
