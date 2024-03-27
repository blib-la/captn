/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
import path from "node:path";

import type { Config } from "jest";
const toPath = path_ => path.join(process.cwd(), path_);
import { defaults } from "jest-config";

const config: Config = {
	...defaults,
	clearMocks: true,
	coveragePathIgnorePatterns: ["dist/*", "node_modules"],
	transform: {
		"^.+\\.(t|j)sx?$": [
			"@swc/jest",
			{
				jsc: {
					transform: {
						react: {
							runtime: "automatic",
						},
					},
				},
			},
		],
	},
	moduleNameMapper: {
		"@captn/joy(.*)$": "<rootDir>/packages/joy/src$1",
		"@captn/react(.*)$": "<rootDir>/packages/react/src$1",
		"@captn/theme(.*)$": "<rootDir>/packages/theme/src$1",
		"@captn/utils(.*)$": "<rootDir>/packages/utils/src$1",
	},
	collectCoverage: true,
	coverageDirectory: "./coverage",
	coverageProvider: "v8",
	coverageReporters: ["lcov", "text", "json"],
	coverageThreshold: {
		global: {
			lines: 80,
		},
	},
	testEnvironment: "jsdom",
	transformIgnorePatterns: ["/node_modules/(?!dot-prop).+\\.js$"],
	extensionsToTreatAsEsm: [".ts", ".tsx"],
};

export default config;
