import { LOCAL_PROTOCOL } from "@captn/utils/constants";

import { getActionArguments, injectPrompt, localFile } from "../string";

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

describe("injectPrompt", () => {
	it("should replace the placeholder with the specified prompt text", () => {
		const template = "a photo of { prompt }, highres, bokeh";
		const prompt = "a cute puppy playing with a red ball";
		const result = injectPrompt(prompt, template);
		expect(result).toBe("a photo of a cute puppy playing with a red ball, highres, bokeh");
	});

	it("should replace the placeholder regardless of surrounding whitespace", () => {
		const template = "a photo of {   prompt   }, highres, bokeh";
		const prompt = "a cute puppy playing with a red ball";
		const result = injectPrompt(prompt, template);
		expect(result).toBe("a photo of a cute puppy playing with a red ball, highres, bokeh");
	});

	it("should replace the placeholder case-insensitively", () => {
		const template = "a photo of { PROMPT }, highres, bokeh";
		const prompt = "a cute puppy playing with a red ball";
		const result = injectPrompt(prompt, template);
		expect(result).toBe("a photo of a cute puppy playing with a red ball, highres, bokeh");
	});

	it("should not change the template if no placeholder is found", () => {
		const template = "a photo of a landscape, highres, bokeh";
		const prompt = "a cute puppy playing with a red ball";
		const result = injectPrompt(prompt, template);
		expect(result).toBe("a photo of a landscape, highres, bokeh");
	});

	it("should handle empty prompt correctly", () => {
		const template = "a photo of { prompt }, highres, bokeh";
		const prompt = "";
		const result = injectPrompt(prompt, template);
		expect(result).toBe("a photo of , highres, bokeh");
	});

	it("should handle empty template correctly", () => {
		const template = "";
		const prompt = "a cute puppy playing with a red ball";
		const result = injectPrompt(prompt, template);
		expect(result).toBe("");
	});
});
