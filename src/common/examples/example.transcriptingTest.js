test("Test 1", () => {
  console.log("Logging to the console");
  expect(someFunction()).toBe(true);
});

test("Test 2", () => {
  console.warn("Warning message");
  expect(anotherFunction()).toBe(false);
});

test("Test 3", () => {
  console.error("Error message");
  expect(anotherFunction()).toBe(false);
});

test("Test 4", () => {
  console.info("Info message");
  expect(anotherFunction()).toBe(false);
});
