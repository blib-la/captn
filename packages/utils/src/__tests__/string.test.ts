import { LOCAL_PROTOCOL } from "@captn/utils/constants";

import { getActionArguments, localFile } from "../string";

describe("getActionArguments", () => {
	it("parses command and captainId", () => {
		expect(getActionArguments("focus:color-mode-settings")).toEqual({
			command: "focus",
			captainId: "color-mode-settings",
			value: undefined,
			options: undefined,
		});
	});

	it("parses command, captainId, and value", () => {
		expect(getActionArguments("click:language-settings:English")).toEqual({
			command: "click",
			captainId: "language-settings",
			value: "English",
			options: undefined,
		});
	});

	it("parses command, captainId, value, and options", () => {
		expect(getActionArguments("type:feedback-form:this app is amazing|submit")).toEqual({
			command: "type",
			captainId: "feedback-form",
			value: "this app is amazing",
			options: "submit",
		});
	});

	it("handles special characters in value", () => {
		expect(getActionArguments("type:feedback-form:this app: amazing|submit")).toEqual({
			command: "type",
			captainId: "feedback-form",
			value: "this app: amazing",
			options: "submit",
		});
	});

	it("parses multiple options correctly", () => {
		expect(getActionArguments("type:feedback-form:this app is amazing|submit|urgent")).toEqual({
			command: "type",
			captainId: "feedback-form",
			value: "this app is amazing",
			options: "submit|urgent",
		});
	});
});

describe("localFile", () => {
	const defaultProtocol = LOCAL_PROTOCOL;
	const customProtocol = "customProtocol";
	const absoluteFilePath = "C:/Users/example/path/to/myFile.txt";

	it("should construct a URI with the default protocol when no protocol is provided", () => {
		const expectedUri = `${defaultProtocol}://${absoluteFilePath}`;
		const uri = localFile(absoluteFilePath, {});
		expect(uri).toBe(expectedUri);
	});

	it("should construct a URI with a custom protocol when one is provided", () => {
		const expectedUri = `${customProtocol}://${absoluteFilePath}`;
		const uri = localFile(absoluteFilePath, { localProtocol: customProtocol });
		expect(uri).toBe(expectedUri);
	});

	it("should construct a URI with the default protocol when options are not provided", () => {
		const expectedUri = `${defaultProtocol}://${absoluteFilePath}`;
		const uri = localFile(absoluteFilePath);
		expect(uri).toBe(expectedUri);
	});
});
