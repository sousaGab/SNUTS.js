import astService from "../../services/ast.service";

const createCSV = (files = []) => {
  const headers = [
    "file",
    "describeCount",
    "itCount",
    "complexSnapshots",
    "identicalTestDescription",
    "nonFunctionalStatement",
    "onlyTest",
    "subOptimalAssert",
    "unusedImports",
    "verboseTest",
    "verifyInSetup",
  ];
  const csv = [headers];
  csv[0] = headers.join(",");
  files.forEach((file) => {
    const row = [file];

    try {
      const ast = astService.parseToAst(file);
      const infos = astService.getTestInfo();
      row.push(infos.describeCount);
      row.push(infos.itCount);
    } catch (error) {}
  });
};
