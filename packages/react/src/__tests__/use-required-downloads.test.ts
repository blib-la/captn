import { DOWNLOADS_MESSAGE_KEY } from "@captn/utils/constants";
import { act, renderHook, waitFor } from "@testing-library/react";

import { useRequiredDownloads } from "../use-required-downloads";

describe("useRequiredDownloads", () => {
	const requiredDownloads = [
		{
			id: "download-1",
			source: "https://example.com/file1.zip",
			destination: "path/to/file1.zip",
			label: "File 1",
		},
		{
			id: "download-2",
			source: "https://example.com/file2.zip",
			destination: "path/to/file2.zip",
			label: "File 2",
		},
	];

	beforeEach(() => {
		// Mock `window.ipc` with jest functions for `send` and `on`
		Object.defineProperty(window, "ipc", {
			writable: true,
			value: {
				send: jest.fn(),
				on: jest.fn(() => () => {}),
				inventoryStore: {
					get: jest.fn().mockResolvedValue([]),
				},
			},
		});
	});

	it("initializes with correct state", async () => {
		const { result } = renderHook(() => useRequiredDownloads(requiredDownloads));
		await waitFor(() => result.current.isCompleted === false);
		expect(result.current.isCompleted).toBe(false);
		expect(result.current.isDownloading).toBe(false);
		expect(result.current.downloadCount).toBe(0);
		expect(result.current.percent).toBe(0);
		expect(result.current.requiredDownloads).toEqual(requiredDownloads);
	});

	it("initiates downloads correctly", async () => {
		const { result } = renderHook(() => useRequiredDownloads(requiredDownloads));

		await waitFor(() => result.current.isCompleted === false);
		act(() => {
			result.current.download();
		});

		expect(window.ipc.send).toHaveBeenCalledTimes(requiredDownloads.length);
		for (const download of requiredDownloads) {
			expect(window.ipc.send).toHaveBeenCalledWith(DOWNLOADS_MESSAGE_KEY, {
				action: "download",
				payload: expect.objectContaining({
					id: download.id,
					source: download.source,
					destination: download.destination,
					label: download.label,
					createdAt: expect.any(Number),
				}),
			});
		}
	});
	it("handles download completion correctly", async () => {
		const { result } = renderHook(() => useRequiredDownloads(requiredDownloads));

		await waitFor(() => expect(result.current.isCompleted).toBe(false));

		// Simulate the completion of each download
		requiredDownloads.forEach(async (download, index) => {
			act(() => {
				const onCallback = (window.ipc.on as jest.Mock).mock.calls.find(
					call => call[0] === DOWNLOADS_MESSAGE_KEY
				)[1];
				onCallback({ action: "COMPLETED", payload: { id: download.id } });
			});

			// Check if the download count is correctly updated after each download completes
			await waitFor(() => expect(result.current.downloadCount).toBe(index + 1));
		});

		// After all downloads are completed, `isCompleted` should be true
		await waitFor(() => expect(result.current.isCompleted).toBe(true));
	});

	it("updates download progress correctly", async () => {
		const { result } = renderHook(() => useRequiredDownloads(requiredDownloads));
		await waitFor(() => expect(result.current.isCompleted).toBe(false));

		// Trigger a download to have an active download
		act(() => {
			result.current.download();
		});

		// Simulate download progress
		const downloadId = requiredDownloads[0].id;
		const progressEvent = {
			action: "PROGRESS",
			payload: { id: downloadId, percent: 0.5 },
		};
		act(() => {
			const onCallback = (window.ipc.on as jest.Mock).mock.calls.find(
				call => call[0] === DOWNLOADS_MESSAGE_KEY
			)[1];
			onCallback(progressEvent);
		});

		await waitFor(() => expect(result.current.percent).toBe(0.5));
	});

	it("should start a download", async () => {
		const { result } = renderHook(() => useRequiredDownloads(requiredDownloads));
		await waitFor(() => expect(result.current.isCompleted).toBe(false));

		act(() => {
			result.current.download();
		});

		const downloadId = requiredDownloads[0].id;
		const progressEvent = {
			action: "STARTED",
			payload: { id: downloadId, percent: 0 },
		};
		act(() => {
			const onCallback = (window.ipc.on as jest.Mock).mock.calls.find(
				call => call[0] === DOWNLOADS_MESSAGE_KEY
			)[1];
			onCallback(progressEvent);
		});

		await waitFor(() => expect(result.current.isDownloading).toBe(true));
	});

	it("should ignore unrelated downloads", async () => {
		const { result } = renderHook(() => useRequiredDownloads(requiredDownloads));
		await waitFor(() => expect(result.current.isCompleted).toBe(false));

		act(() => {
			result.current.download();
		});

		const downloadId = "some-unrelated-item";
		const progressEvent = {
			action: "PROGRESS",
			payload: { id: downloadId, percent: 0.5 },
		};
		act(() => {
			const onCallback = (window.ipc.on as jest.Mock).mock.calls.find(
				call => call[0] === DOWNLOADS_MESSAGE_KEY
			)[1];
			onCallback(progressEvent);
		});

		await waitFor(() => expect(result.current.percent).toBe(0));
	});

	it("should recognize downloads already exist in the inventory", async () => {
		// Override the mock for `inventoryStore.get` for this test case
		(window.ipc.inventoryStore.get as jest.Mock).mockResolvedValue(
			requiredDownloads.map(({ id }) => ({ id }))
		);

		const { result } = renderHook(() => useRequiredDownloads(requiredDownloads));

		await waitFor(() => {
			// Assuming your hook updates `isCompleted` or similar state once it verifies the downloads exist
			expect(result.current.isCompleted).toBe(true);
		});
	});
});
