// const { resolve } = require("path");
// const root = resolve(__dirname);

// module.exports = {
//   rootDir: root,
//   displayName: "root-tests",
//   testMatch: ["<rootDir>/src/**/*.test.js"],
//   testEnvironment: "node",
//   clearMocks: true,
//   modulePaths: ["<rootDir>/src"],
//   preset: "ts-jest",
//   moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "json"],
//   transform: {
//     "^.+\\.(js|jsx)?$": "babel-jest",
//   },
//   testEnvironment: "node",
//   verbose: false,
// };

module.exports = {
  rootDir: __dirname,
  verbose: true,
  bail: true,
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
  preset: "ts-jest",
  moduleNameMapper: {},
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],
  modulePaths: ["<rootDir>/src"],
  moduleDirectories: ["<rootDir>/node_modules"],
  restoreMocks: true,
  testMatch: ["<rootDir>/src/**/*.test.js"],
  moduleFileExtensions: ["js"],
  modulePathIgnorePatterns: ["<rootDir>/dist", "<rootDir>/dev"],
  // collectCoverage: true,
  // collectCoverageFrom: ['!**/node_modules/**', 'src/**'],
  // coverageDirectory: 'coverage',
  // coverageReporters: ['html', 'json'],
  cacheDirectory: ".cache/jest",
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "json"],
  transform: {
    "^.+\\.(js|jsx)?$": "babel-jest",
  },
  testEnvironment: "node",
};
