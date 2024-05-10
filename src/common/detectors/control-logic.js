import { traverse } from "@babel/types";
import * as t from "@babel/types";

const detectControlLogic = (ast) => {
  console.log("HELLO");
  const controlLogicSmells = [];
  traverse(ast, {
    IfStatement(path) {
      controlLogicSmells.push(path);
    },
    SwitchStatement(path) {
      controlLogicSmells.push(path);
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
        controlLogicSmells.push(path);
      }
    },
  });
  console.log("control logic", controlLogicSmells);
  return controlLogicSmells;
};
export default detectControlLogic;
