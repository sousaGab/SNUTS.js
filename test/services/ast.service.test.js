import { describe, expect, it } from "vitest";
import astService from "../../src/services/ast.service";

describe("Ast Service", () => {
  it("should correctly count describe block", () => {
    const code = `
    describe('My Test Suite', () => {
      it('should do something', () => {
        expect(true).toBe(true);
      });

      it('should do another thing', () => {
        expect(false).toBe(false);
      });
    });
  `;

    const result = astService.parseCodeToAst(code);
    const describeCount = astService.getDescribeCount(result);
    expect(describeCount).toBe(1);
  });

  it("should correctly count it/test block", () => {
    const code = `
    describe('My Test Suite', () => {
      it('should do something', () => {
        expect(true).toBe(true);
      });

      test('should do another thing', () => {
        expect(false).toBe(false);
      });
    });
  `;

    const result = astService.parseCodeToAst(code);
    const describeCount = astService.getItCount(result);
    expect(describeCount).toBe(2);
  });

  it("should parse code in ast", () => {
    const code = `
        test("some test", () =>{
            expect(12).toBe(12)
        })
        it("should be a test", () =>{
            expect(true).toBeDefined()
        })
      `;
    const result = astService.parseCodeToAst(code);
    expect(result).toBeDefined();
  });

  it("should parse typescript code in ast", () => {
    const tsCode = `
        test("some test", () =>{
            const userName:string = "John Doe"
            expect(userName).toBeEqual("John Doe")
        })
    `;
    const result = astService.parseCodeToAst(tsCode);
    expect(result).toBeDefined();
  });

  it("should parse code with import anywhere", () => {
    const code = `
        const myFunc = require('my-module');
        it('example', () => {
            expect(myFunc()).toBe(true);
        });
    `;
    const ast = astService.parseCodeToAst(code);
    expect(ast).toBeDefined();
  });

  it("should parse code to AST and return the correct test node", () => {
    const code = `
    describe('some test', () => {
      it('should do something', () => {
        expect(true).toBe(true);
      });
    });
  `;
    const testNode = astService.getTestNodeAst(code);
    expect(testNode).toBeDefined();
    expect(testNode.node.callee.name).toBe("it");
  });

  it("should detect a assertion with expect/assert", () => {
    const setupCode = `
    describe("some test", ()=>{
      it("should check numbers",() =>{
        expect(13).toBe(13)
      })
    })
  `;
    const ast = astService.parseCodeToAst(setupCode);
    const result = astService.hasAssertion(ast);
    expect(result).toBeTruthy();
  });
});
