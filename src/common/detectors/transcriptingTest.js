import traverse from "@babel/traverse";
import * as t from "@babel/types";

const traverseDefault = traverse.default;

const detectTranscriptingTest = (ast) => {
  const transcriptingTestSmells = [];
  traverseDefault(ast, {
    CallExpression(path) {
      const { callee, arguments: args, loc } = path.node;
      if (
        /it|test/.test(node.callee.name) &&
        args.length >= 2 &&
        (hasConsoleLog(args[1]) ||
          hasConsoleError(args[1]) ||
          hasConsoleWarn(args[1]) ||
          hasConsoleInfo(args[1]))
      ) {
        transcriptingTestSmells.push({
          path,
          startLine: loc.start.line,
          endLine: loc.end.line,
        });
      }
    },
  });
  return transcriptingTestSmells;
};

const hasConsoleLog = (node) => {
  return (
    t.isCallExpression(node) &&
    t.isMemberExpression(node.callee) &&
    t.isIdentifier(node.callee.object, { name: "console" }) &&
    t.isIdentifier(node.callee.property, { name: "log" })
  );
};

const hasConsoleError = (node) => {
  return (
    t.isCallExpression(node) &&
    t.isMemberExpression(node.callee) &&
    t.isIdentifier(node.callee.object, { name: "console" }) &&
    t.isIdentifier(node.callee.property, { name: "error" })
  );
};

const hasConsoleWarn = (node) => {
  return (
    t.isCallExpression(node) &&
    t.isMemberExpression(node.callee) &&
    t.isIdentifier(node.callee.object, { name: "console" }) &&
    t.isIdentifier(node.callee.property, { name: "warn" })
  );
};

const hasConsoleInfo = (node) => {
  return (
    t.isCallExpression(node) &&
    t.isMemberExpression(node.callee) &&
    t.isIdentifier(node.callee.object, { name: "console" }) &&
    t.isIdentifier(node.callee.property, { name: "info" })
  );
};

export default detectTranscriptingTest;
