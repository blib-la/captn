import { USER_LANGUAGE_KEY } from "@captn/utils/constants";
import { IPCHandlers } from "@captn/utils/types";
import { renderHook, act } from "@testing-library/react";

import { useLanguage } from "../use-language";

// Mock the IPC event system
const mockOn = jest.fn();
const mockUnsubscribe = jest.fn();
window.ipc = {
	on: jest.fn((key, callback) => {
		mockOn(key, callback);
		return mockUnsubscribe;
	}),
} as unknown as IPCHandlers;

describe("useLanguage", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should register and unregister the language change listener", () => {
		const { unmount } = renderHook(() => useLanguage(jest.fn()));

		// Check that the ipc.on was called correctly
		expect(window.ipc.on).toHaveBeenCalledWith(USER_LANGUAGE_KEY, expect.any(Function));
		expect(mockOn).toHaveBeenCalledWith(USER_LANGUAGE_KEY, expect.any(Function));

		// Unmount the hook and check if cleanup is performed correctly
		unmount();
		expect(mockUnsubscribe).toHaveBeenCalled();
	});

	it("should handle callback updates correctly", () => {
		const mockCallback1 = jest.fn();
		const mockCallback2 = jest.fn();

		const { rerender } = renderHook(({ callback }) => useLanguage(callback), {
			initialProps: { callback: mockCallback1 },
		});

		// Simulate a language change
		const language = "en";
		act(() => {
			const callback = mockOn.mock.calls[0][1];
			callback(language);
		});
		expect(mockCallback1).toHaveBeenCalledWith(language);

		// Update the callback and simulate another language change
		rerender({ callback: mockCallback2 });
		const newLanguage = "de";
		act(() => {
			const callback = mockOn.mock.calls[0][1]; // The callback should remain the same reference
			callback(newLanguage);
		});
		expect(mockCallback2).toHaveBeenCalledWith(newLanguage);
		expect(mockCallback1).not.toHaveBeenCalledWith(newLanguage);
	});
});
