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
		"@captn/joy(.*)": "<rootDir>/packages/joy/src/$",
		"@captn/react(.*)": "<rootDir>/packages/react/src/$",
		"@captn/theme(.*)": "<rootDir>/packages/theme/src/$",
		"@captn/utils(.*)": "<rootDir>/packages/utils/src/$",
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
	transformIgnorePatterns: ["/node_modules/"],
	extensionsToTreatAsEsm: [".ts", ".tsx"],
};

export default config;
