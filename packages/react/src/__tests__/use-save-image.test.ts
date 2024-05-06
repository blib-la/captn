import { renderHook, act, waitFor } from "@testing-library/react";

import { useResettableState } from "../use-resettable-state";
import { useSaveImage } from "../use-save-image";
import { useSDK } from "../use-sdk";

jest.mock("uuid", () => ({
	v4: jest.fn(() => "fixed-uuid"),
}));
jest.mock("../use-sdk", () => ({
	useSDK: jest.fn(),
}));
jest.mock("../use-resettable-state", () => ({
	useResettableState: jest.fn(),
}));

const mockWriteFile = jest.fn();
const mockSetSaved = jest.fn();

(useSDK as jest.Mock).mockImplementation(() => ({
	writeFile: mockWriteFile,
}));

(useResettableState as jest.Mock).mockImplementation((initialState, delay) => {
	let state = initialState;
	const setState = jest.fn(newState => {
		if (typeof newState === "function") {
			state = newState(state);
		} else {
			state = newState;
		}

		if (state === false) {
			mockSetSaved(state);
		}
	});

	setTimeout(() => setState(false), delay);

	return [state, setState];
});
describe("useSaveImage", () => {
	beforeEach(() => {
		jest.useFakeTimers();
		mockWriteFile.mockClear();
		mockSetSaved.mockClear();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it("saves image on save function call", async () => {
		const { result } = renderHook(() =>
			useSaveImage({
				image: "data:image/png;base64,XYZ",
				prompt: "test-prompt",
				appId: "app123",
			})
		);

		await act(async () => {
			await result.current.save();
		});

		expect(mockWriteFile).toHaveBeenCalledWith(
			"images/fixed-uuid.png",
			"XYZ",
			{ encoding: "base64" },
			"test-prompt"
		);
	});

	it("resets saved state after delay", async () => {
		const { result } = renderHook(() =>
			useSaveImage({
				image: "data:image/png;base64,XYZ",
				prompt: "test-prompt",
				appId: "app123",
				resetDelay: 2000,
			})
		);

		act(() => {
			result.current.save();
		});

		act(() => {
			jest.advanceTimersByTime(2000);
		});

		await waitFor(() => expect(mockSetSaved).toHaveBeenCalledWith(false));
	});

	it("handles Ctrl+S keydown to trigger save", () => {
		renderHook(() =>
			useSaveImage({
				image: "data:image/png;base64,XYZ",
				prompt: "test-prompt",
				appId: "app123",
			})
		);

		act(() => {
			const event = new KeyboardEvent("keydown", { key: "s", ctrlKey: true });
			window.dispatchEvent(event);
		});

		expect(mockWriteFile).toHaveBeenCalled();
	});
});
