import traverse from "@babel/traverse";
import * as t from "@babel/types";

const traverseDefault = traverse.default;

const countComments = (node) => {
  let commentCount = 0;

  traverseDefault(node, {
    noScope: true, // Prevents creation of new scope
    enter(path) {
      if (path.node.leadingComments) {
        commentCount += path.node.leadingComments.length;
      }
      if (path.node.trailingComments) {
        commentCount += path.node.trailingComments.length;
      }
    },
  });

  return commentCount;
};

const hasManyComments = (node, threshold) => {
  return countComments(node) > threshold;
};

const detectOvercommentedTest = (ast) => {
  const overcommentedTestSmells = [];
  traverseDefault(ast, {
    CallExpression(path) {
      const { callee, arguments: args, loc } = path.node;
      if (args.length >= 2) {
        if (
          /^(it|test)$/.test(callee.name) &&
          t.isFunction(args[1]) &&
          hasManyComments(args[1], 5) // Check if the test function has more than 5 comments
        ) {
          overcommentedTestSmells.push({
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
