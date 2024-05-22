import traverse from "@babel/traverse";
import * as t from "@babel/types";
const traverseDefault = traverse.default;

const isCommentsOnly = (body) => {
  // Check if the body consists only of comments
  return body.every((statement) => {
    // Check if the statement is an empty expression statement that might only have comments
    if (t.isExpressionStatement(statement) && !statement.expression) {
      return true;
    }
    // Check if the statement is a block that might only have comments
    if (t.isBlockStatement(statement) && statement.body.length === 0) {
      return true;
    }
    return false;
  });
};

const detectCommentsOnlyTest = (ast) => {
  const commentsOnlyTestSmells = [];
  traverseDefault(ast, {
    CallExpression(path) {
      const { callee, arguments: args, loc } = path.node;
      if (/^(it|test)$/.test(callee.name) && args.length >= 2) {
        const testBody = args[1].body;
        if (t.isBlockStatement(testBody) && isCommentsOnly(testBody.body)) {
          commentsOnlyTestSmells.push({
            startLine: loc.start.line,
            endLine: loc.end.line,
          });
        }
      }
    },
  });
  return commentsOnlyTestSmells;
};

export default detectCommentsOnlyTest;
