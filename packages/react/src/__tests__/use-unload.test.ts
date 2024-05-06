import { renderHook } from "@testing-library/react";

import { useSDK } from "../use-sdk";
import { useUnload } from "../use-unload";

// Mock the useSDK hook
jest.mock("../use-sdk", () => ({
	useSDK: jest.fn(),
}));

describe("useUnload", () => {
	beforeEach(() => {
		// Reset mocks before each test
		jest.clearAllMocks();
	});

	it("adds and removes the beforeunload event listener correctly", () => {
		const mockSend = jest.fn();
		(useSDK as jest.Mock).mockImplementation(() => ({ send: mockSend }));

		// Mock addEventListener and removeEventListener
		const addEventListenerSpy = jest.spyOn(window, "addEventListener");
		const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

		const { unmount } = renderHook(() => useUnload("myAppId", "testAction"));

		// Check if the 'beforeunload' event listener was added
		expect(addEventListenerSpy).toHaveBeenCalledWith("beforeunload", expect.any(Function));

		// Trigger the beforeunload event
		const event = new Event("beforeunload");
		window.dispatchEvent(event);

		// Check if the send function was called correctly
		expect(mockSend).toHaveBeenCalledWith({ action: "testAction", payload: "myAppId" });

		// Unmount the hook and check if the event listener was removed
		unmount();
		expect(removeEventListenerSpy).toHaveBeenCalledWith("beforeunload", expect.any(Function));

		// Cleanup spies to avoid memory leaks
		addEventListenerSpy.mockRestore();
		removeEventListenerSpy.mockRestore();
	});
});
