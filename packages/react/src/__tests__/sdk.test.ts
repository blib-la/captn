import { renderHook, act } from "@testing-library/react";

import { useSDK } from "../use-sdk";

describe("useSDK hook", () => {
	beforeEach(() => {
		// Setup window.ipc with mock implementations
		Object.defineProperty(window, "ipc", {
			value: {
				send: jest.fn(),
				on: jest.fn(() => jest.fn()), // Ensuring on() returns an unsubscribe function mock
			},
			configurable: true, // This allows the property to be deleted or changed if necessary
		});
	});

	afterEach(() => {
		// Clear all mocks before each test
		jest.clearAllMocks();
	});

	it("sends messages correctly", () => {
		const { result } = renderHook(() => useSDK("myAppId", {}));

		act(() => {
			result.current.send({ action: "greet", payload: "Hello, SDK!" });
		});

		expect(window.ipc.send).toHaveBeenCalledWith(expect.anything(), {
			message: { action: "greet", payload: "Hello, SDK!" },
			appId: "myAppId",
		});
	});

	it("calls onMessage when a message is received", () => {
		const onMessageMock = jest.fn();
		const onErrorMock = jest.fn();

		// Adjust the mock for window.ipc.on to simulate receiving a message
		const mockOn = window.ipc.on as jest.Mock;
		mockOn.mockImplementation((_channel, callback) => {
			const message = { action: "answer", payload: "Received message" };
			callback(message); // Simulate invoking the callback with a message
			return () => {}; // Unsubscribe function
		});

		const { rerender } = renderHook(() =>
			useSDK("myAppId", {
				onMessage: onMessageMock,
				onError: onErrorMock,
			})
		);

		// Trigger a re-render to simulate receiving the message after the hook has been initialized
		rerender();

		expect(onMessageMock).toHaveBeenCalledWith({
			action: "answer",
			payload: "Received message",
		});
		expect(onErrorMock).not.toHaveBeenCalled();
	});

	it("calls onError when an error occurs during message reception", () => {
		const onMessageMock = jest.fn();
		const onErrorMock = jest.fn();

		// Adjust the mock for window.ipc.on to simulate an error
		const mockOn = window.ipc.on as jest.Mock;
		mockOn.mockImplementation(() => {
			throw new Error("Test error"); // Simulate an error being thrown
		});

		const { rerender } = renderHook(() =>
			useSDK("myAppId", {
				onMessage: onMessageMock,
				onError: onErrorMock,
			})
		);

		// Trigger a re-render to simulate the hook attempting to handle the error
		rerender();

		expect(onErrorMock).toHaveBeenCalledWith(expect.any(Error));
		expect(onMessageMock).not.toHaveBeenCalled();
	});
});
