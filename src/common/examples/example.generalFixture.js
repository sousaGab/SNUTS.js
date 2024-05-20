const exampleGeneralFixture = `
let user;
let admin;
let guest;

beforeEach(() => {
  user = new User("Alice", 30);
  admin = new Admin("Bob", 40);
  guest = new Guest("Charlie", 25);
});

test("user should have a name", () => {
  expect(user.name).toBe("Alice");
});

test("admin should have an age", () => {
  expect(admin.age).toBe(40);
});
`;

export default exampleGeneralFixture;
