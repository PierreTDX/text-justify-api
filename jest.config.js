const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  testMatch: ['**/*.test.ts'], // seuls les fichiers *.test.ts seront exécutés
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'], // ton setup
};