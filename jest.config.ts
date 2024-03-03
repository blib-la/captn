/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
import path from "node:path";

import type { Config } from "jest";
const toPath = path_ => path.join(process.cwd(), path_);

const config: Config = {
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: "./coverage",
	coverageProvider: "v8",
	coverageReporters: ["lcov", "text"],
	coveragePathIgnorePatterns: ["dist/*", "node_modules"],
	moduleFileExtensions: ["js", "mjs", "cjs", "jsx", "ts", "tsx", "json", "node"],
	transform: {
		"\\.[jt]sx?$": "@swc/jest",
	},
	transformIgnorePatterns: ["node_modules/(?!humanize-string)/"],
	moduleNameMapper: {
		"(.+)\\.js": "$1",
		"^@captn/joy": toPath("/packages/joy/src"),
		"^@captn/react": toPath("/packages/react/src"),
		"^@captn/theme": toPath("/packages/theme/src"),
		"^@captn/utils": toPath("/packages/utils/src"),
	},
	extensionsToTreatAsEsm: [".ts", ".tsx"],
};

export default config;
