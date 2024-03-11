import { getActionArguments } from "../string";

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
