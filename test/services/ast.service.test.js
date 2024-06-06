import { describe, expect, it } from "vitest";
import astService from "../../src/services/ast.service";

describe("Ast Service", () => {
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
});
