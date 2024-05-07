import { USER_THEME_KEY } from "@captn/utils/constants";
import { IPCHandlers } from "@captn/utils/types";
import { renderHook, act } from "@testing-library/react";

import { useTheme } from "../use-theme";

// Mock the IPC event system
const mockOn = jest.fn();
const mockUnsubscribe = jest.fn();
window.ipc = {
	on: jest.fn((key, callback) => {
		mockOn(key, callback);
		return mockUnsubscribe;
	}),
} as unknown as IPCHandlers;

describe("useTheme", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("registers and unregisters the theme change listener", () => {
		const { unmount } = renderHook(() => useTheme(jest.fn()));

		// Expect that ipc.on was called with USER_THEME_KEY
		expect(window.ipc.on).toHaveBeenCalledWith(USER_THEME_KEY, expect.any(Function));

		// Unmount the hook to simulate the component unmounting
		unmount();

		// Expect that the unsubscribe function was called
		expect(mockUnsubscribe).toHaveBeenCalled();
	});

	it("handles theme updates correctly", () => {
		const callback = jest.fn();
		const { rerender } = renderHook(({ callback }) => useTheme(callback), {
			initialProps: { callback },
		});

		// Simulate an IPC event that changes the theme
		act(() => {
			const themeCallback = mockOn.mock.calls[0][1];
			themeCallback("dark");
		});

		// Check that the callback was called with the right argument
		expect(callback).toHaveBeenCalledWith("dark");

		// Change the callback function
		const newCallback = jest.fn();
		rerender({ callback: newCallback });

		// Simulate another IPC event
		act(() => {
			const themeCallback = mockOn.mock.calls[0][1];
			themeCallback("light");
		});

		// Verify the new callback is called
		expect(newCallback).toHaveBeenCalledWith("light");
		expect(callback).not.toHaveBeenCalledWith("light");
	});
});
