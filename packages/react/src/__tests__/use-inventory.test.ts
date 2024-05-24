import { IPCHandlers } from "@captn/utils/types";
import { renderHook, waitFor } from "@testing-library/react";

import { useInventory, Inventory, StableDiffusion } from "../use-inventory";

// Mocking the ipc inventoryStore
window.ipc = {
	inventoryStore: {
		get: jest.fn(),
	},
} as unknown as IPCHandlers;

describe("useInventory", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should fetch inventory data successfully", async () => {
		const mockData: StableDiffusion = {
			checkpoints: [
				{
					id: "1",
					filePath: "/path/to/file",
					modelPath: "/path/to/model",
					label: "checkpoint1",
				},
			],
			loras: [
				{
					id: "2",
					filePath: "/path/to/file2",
					modelPath: "/path/to/model2",
					label: "lora1",
				},
			],
		};
		(window.ipc.inventoryStore.get as jest.Mock).mockResolvedValue(mockData);

		const { result } = renderHook(() =>
			useInventory<StableDiffusion>("stable-diffusion-config")
		);

		await waitFor(() => {
			expect(result.current.data).toEqual(mockData);
			expect(result.current.error).toBeUndefined();
		});
	});

	it("should handle error during fetch", async () => {
		const mockError = new Error("Failed to fetch");
		(window.ipc.inventoryStore.get as jest.Mock).mockRejectedValue(mockError);

		const { result } = renderHook(() =>
			useInventory<StableDiffusion>("stable-diffusion-config")
		);

		await waitFor(() => {
			expect(result.current.error).toBe(mockError);
			expect(result.current.data).toBeUndefined();
		});
	});

	it("should use provided SWR configuration", async () => {
		const mockData: Inventory[] = [
			{
				id: "1",
				filePath: "/path/to/file",
				modelPath: "/path/to/model",
				label: "inventory1",
			},
		];
		(window.ipc.inventoryStore.get as jest.Mock).mockResolvedValue(mockData);

		const config = {
			refreshInterval: 1000,
		};

		const { result } = renderHook(() => useInventory<Inventory[]>("inventory-key", config));

		await waitFor(() => {
			expect(result.current.data).toEqual(mockData);
			expect(result.current.error).toBeUndefined();
		});
	});
});
