import { renderHook, act } from "@testing-library/react";

import { useComfyUI } from "../use-comfyui";
import { useInventory } from "../use-inventory";
import { useSDK } from "../use-sdk";
import { useUnload } from "../use-unload";

jest.mock("../use-inventory");
jest.mock("../use-sdk");
jest.mock("../use-unload");

describe("useComfyUI", () => {
	const mockUseInventory = useInventory as jest.Mock;
	const mockUseSDK = useSDK as jest.Mock;
	const mockUseUnload = useUnload as jest.Mock;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should initialize with default values", () => {
		mockUseInventory.mockReturnValue({ data: {} });
		mockUseSDK.mockReturnValue({ send: jest.fn() });

		const onGenerated = jest.fn();
		const { result } = renderHook(() => useComfyUI("appId", onGenerated));

		expect(result.current.queueSize).toBe(0);
		expect(result.current.isGenerating).toBe(false);
		expect(result.current.image).toBe(null);
		expect(result.current.models).toEqual({
			loras: [],
			checkpoints: [],
			vae: [],
			upscalers: [],
		});
	});

	it("should handle generating state and image generation", () => {
		const send = jest.fn();
		mockUseInventory.mockReturnValue({
			data: {
				loras: [{ id: "1", filePath: "path1", modelPath: "model1", label: "lora1" }],
				checkpoints: [
					{ id: "2", filePath: "path2", modelPath: "model2", label: "checkpoint1" },
				],
				vae: [],
				upscalers: [],
			},
		});
		mockUseSDK.mockReturnValue({ send });

		const onGenerated = jest.fn();
		const { result } = renderHook(() => useComfyUI("appId", onGenerated));

		act(() => {
			result.current.generate("workflow_string_here");
		});

		expect(result.current.isGenerating).toBe(true);
		expect(send).toHaveBeenCalledWith({
			action: "comfyui:queue",
			payload: {
				workflow: "workflow_string_here",
			},
		});
	});

	it("should handle message updates correctly", () => {
		const send = jest.fn();
		let onMessage: (message: any) => void = () => {};

		mockUseSDK.mockImplementation((_appId, { onMessage: onMessageCallback }) => {
			onMessage = onMessageCallback;
			return { send };
		});
		mockUseInventory.mockReturnValue({ data: {} });

		const onGenerated = jest.fn();
		const { result } = renderHook(() => useComfyUI("appId", onGenerated));

		act(() => {
			onMessage({
				action: "comfyui:update",
				payload: {
					data: {
						type: "status",
						data: {
							status: {
								exec_info: {
									queue_remaining: 2,
								},
							},
						},
					},
					comfyUITemporaryPath: "temp_path",
				},
			});
		});

		expect(result.current.queueSize).toBe(2);
		expect(result.current.isGenerating).toBe(true);

		act(() => {
			onMessage({
				action: "comfyui:update",
				payload: {
					data: {
						type: "executed",
						data: {
							output: {
								images: [
									{
										filename: "image.png",
										subfolder: "subfolder",
									},
								],
							},
						},
					},
					comfyUITemporaryPath: "temp_path",
				},
			});
		});

		expect(result.current.image).toBe("temp_path/subfolder/image.png");
		expect(onGenerated).toHaveBeenCalledWith("temp_path/subfolder/image.png", {
			filename: "image.png",
			subfolder: "subfolder",
		});
	});
	it("should register and unregister client on mount and unmount", () => {
		const send = jest.fn();
		mockUseSDK.mockReturnValue({ send });
		mockUseInventory.mockReturnValue({ data: {} });

		const onGenerated = jest.fn();
		const { unmount } = renderHook(() => useComfyUI("appId", onGenerated));

		expect(send).toHaveBeenCalledWith({
			action: "comfyui:registerClient",
			payload: {},
		});

		unmount();

		expect(send).toHaveBeenCalledWith({
			action: "comfyui:unregisterClient",
			payload: {},
		});
	});
});
