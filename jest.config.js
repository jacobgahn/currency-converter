const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	roots: ["<rootDir>/src"],
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
		prefix: "<rootDir>/",
	}),
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	globals: {
		"ts-jest": {
			tsconfig: "tsconfig.json",
		},
	},
	coveragePathIgnorePatterns: ["/node_modules/"],
};
