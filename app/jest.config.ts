export default {
  clearMocks: true,
  coverageProvider: "v8",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts","!**/migrations/*.ts"],
  preset: "ts-jest",
  testMatch: ["**/**/*.spec.ts"],
};
