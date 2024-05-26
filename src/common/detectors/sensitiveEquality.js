import traverse from "@babel/traverse";
import * as t from "@babel/types";
import parser from "@babel/parser";
const traverseDefault = traverse.default;

const jestMatchers = new Set([
  "toEqual",
  "toStrictEqual",
  "toBe",
  "toMatchObject",
]);

const jasmineMatchers = new Set(["toEqual", "toBe", "toMatch"]);

const isToStringMemberExpression = (node) => {
  return (
    t.isCallExpression(node) &&
    t.isMemberExpression(node.callee) &&
    t.isIdentifier(node.callee.property, { name: "toString" })
  );
};

const detectSensitiveEquality = (ast) => {
  const sensitiveEqualitySmells = [];

  const detectCallExpression = (path) => {
    const { callee, arguments: args, loc } = path.node;

    if (
      t.isMemberExpression(callee) &&
      t.isIdentifier(callee.property) &&
      (jestMatchers.has(callee.property.name) ||
        jasmineMatchers.has(callee.property.name)) &&
      args.length > 0 &&
      isToStringMemberExpression(args[0])
    ) {
      sensitiveEqualitySmells.push({
        startLine: loc.start.line,
        endLine: loc.end.line,
      });
    }
  };

  const detectBinaryExpression = (path) => {
    const { left, right, loc } = path.node;
    if (isToStringMemberExpression(left) || isToStringMemberExpression(right)) {
      sensitiveEqualitySmells.push({
        startLine: loc.start.line,
        endLine: loc.end.line,
      });
    }
  };

  traverseDefault(ast, {
    CallExpression: detectCallExpression,
    BinaryExpression: detectBinaryExpression,
  });

  return sensitiveEqualitySmells;
};

/*
TODO: check failsafe
// Example JavaScript code to analyze
const code = `
  test('example test', () => {
    const str = 'example';
    expect(str.toString()).toEqual('example');
  });
`;

// Parse the code to generate the AST
const ast = parser.parse(code, {
  sourceType: "module",
  plugins: ["jsx"],
});

// Run the analysis
const results = detectSensitiveEquality(ast);
// console.log(results);
*/
export default detectSensitiveEquality;
