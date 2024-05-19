import traverse from "@babel/traverse";
import * as t from "@babel/types";

const traverseDefault = traverse.default;

const detectCommentsOnlyTest = (ast) => {
  const commentsOnlyTestSmells = [];
  traverseDefault(ast, {
    CallExpression(path) {
      const { callee, arguments: args, loc } = path.node;
      if (
        /it|test/.test(node.callee.name) &&
        args.length >= 2 &&
        args[1].leadingComments &&
        args[1].leadingComments.length > 0 &&
        args[1].leadingComments[0].type === "CommentBlock"
      ) {
        commentsOnlyTestSmells.push({
          path,
          startLine: loc.start.line,
          endLine: loc.end.line,
        });
      }
    },
  });
  return commentsOnlyTestSmells;
};

export default detectCommentsOnlyTest;
