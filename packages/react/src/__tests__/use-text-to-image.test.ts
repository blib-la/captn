import { renderHook, act } from "@testing-library/react";

import { useSDK } from "../use-sdk";
import { useTextToImage } from "../use-text-to-image";

jest.mock("../use-sdk", () => ({
	useSDK: jest.fn(),
}));

jest.mock("../use-unload", () => ({
	useUnload: jest.fn(),
}));

describe("useTextToImage", () => {
	let sendMock;
	let onMessageHandler;

	beforeEach(() => {
		sendMock = jest.fn();
		onMessageHandler = jest.fn();

		// Mock the useSDK to simulate receiving messages
		(useSDK as jest.Mock).mockImplementation((appId, { onMessage }) => {
			onMessageHandler = onMessage; // Capture the onMessage callback for simulation
			return { send: sendMock };
		});
	});

	it("starts the image generation process correctly", () => {
		const { result } = renderHook(() => useTextToImage("myAppId"));

		act(() => {
			result.current.start({ model: "testModel", model_type: "stable-diffusion" });
		});

		expect(sendMock).toHaveBeenCalledWith({
			action: "text-to-image:start",
			payload: { model: "testModel", model_type: "stable-diffusion" },
		});
		expect(result.current.isLoading).toBeTruthy();
	});

	it("handles the image generation started message", () => {
		const { result } = renderHook(() => useTextToImage("myAppId"));

		// Simulate receiving an IPC message
		act(() => {
			onMessageHandler({
				action: "text-to-image:started",
				payload: "",
			});
		});

		expect(result.current.isRunning).toBeTruthy();
		expect(result.current.isLoading).toBeFalsy();
	});

	it("stops the image generation process correctly", () => {
		const { result } = renderHook(() => useTextToImage("myAppId"));

		act(() => {
			result.current.stop();
		});

		expect(sendMock).toHaveBeenCalledWith({
			action: "text-to-image:stop",
			payload: true,
		});
		expect(result.current.isLoading).toBeTruthy();
	});

	it("generates an image with specified parameters", async () => {
		const { result } = renderHook(() => useTextToImage("myAppId"));

		// Simulate the condition that sets isRunning to true
		act(() => {
			onMessageHandler({
				action: "text-to-image:started",
			});
		});

		// Now, call the generate function
		act(() => {
			result.current.generate({
				prompt: "A beautiful landscape",
				negative_prompt: "buildings",
				seed: 42,
			});
		});

		// Check if the send function was called with the correct parameters
		expect(sendMock).toHaveBeenCalledWith({
			action: "text-to-image:settings",
			payload: {
				prompt: "A beautiful landscape",
				negative_prompt: "buildings",
				seed: 42,
			},
		});

		// Check if the state reflects an ongoing generation process
		expect(result.current.isGenerating).toBeTruthy();
	});
});
