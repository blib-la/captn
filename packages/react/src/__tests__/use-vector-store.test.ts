import {
	ERROR_KEY,
	VECTOR_STORE_SCROLL_KEY,
	VECTOR_STORE_SCROLL_RESULT_KEY,
	VECTOR_STORE_SEARCH_KEY,
	VECTOR_STORE_SEARCH_RESULT_KEY,
} from "@captn/utils/constants";
import { VectorStoreResponse } from "@captn/utils/types";
import { renderHook, act } from "@testing-library/react";

import { useVectorStore, useVectorScroll } from "../use-vector-store";

jest.mock("use-debounce", () => ({
	useDebounce: jest.fn().mockImplementation(value => [value]),
}));

describe("useVectorStore", () => {
	beforeEach(() => {
		// Mock the global window.ipc object
		global.window.ipc = {
			send: jest.fn(),
			on: jest.fn((eventKey, callback) => {
				if (eventKey.includes(VECTOR_STORE_SEARCH_RESULT_KEY)) {
					callback([]);
				} else if (eventKey.includes(ERROR_KEY)) {
					callback("error");
				}

				return () => {}; // Mock unsubscribe function
			}),
		} as any;

		jest.clearAllMocks();
	});

	it("sends the correct query when the debounced value changes", async () => {
		const query = "test query";
		const options = { score_threshold: 0.5 };
		const expectedKey = VECTOR_STORE_SEARCH_KEY;

		renderHook(() => useVectorStore(query, options));

		expect(window.ipc.send).toHaveBeenCalledWith(expectedKey, {
			query,
			options,
		});
	});

	it("mutate function updates the state correctly", async () => {
		const query = "test query";
		const options = { score_threshold: 0.5 };

		const { result } = renderHook(() => useVectorStore(query, options));

		const newState = [
			{
				id: "1",
				score: 0.6,
				payload: {
					type: "image",
					id: "some-id",
					content: "",
					language: "en",
					label: "Test",
				},
			},
		];

		act(() => {
			result.current.mutate(() => newState);
		});

		expect(result.current.data).toEqual(newState);
	});

	it("mutate function triggers a new search with the same query", async () => {
		const query = "test query";
		const options = { score_threshold: 0.5 };
		const expectedKey = VECTOR_STORE_SEARCH_KEY;

		const { result } = renderHook(() => useVectorStore(query, options));

		act(() => {
			result.current.mutate();
		});

		expect(window.ipc.send).toHaveBeenCalledWith(expectedKey, {
			query,
			options,
		});
	});
});

describe("useVectorScroll", () => {
	beforeEach(() => {
		// Mock the global window.ipc object
		global.window.ipc = {
			send: jest.fn(),
			on: jest.fn((eventKey, callback) => {
				if (eventKey.includes(VECTOR_STORE_SCROLL_RESULT_KEY)) {
					callback([]);
				} else if (eventKey.includes(ERROR_KEY)) {
					callback("error");
				}

				return () => {}; // Mock unsubscribe function
			}),
		} as any;

		jest.clearAllMocks();
	});

	it("sends the correct filter when the debounced value changes", async () => {
		const options = { filter: { must: [{ key: "type", match: { value: "image" } }] } };
		const expectedKey = VECTOR_STORE_SCROLL_KEY;

		renderHook(() => useVectorScroll(options));

		expect(window.ipc.send).toHaveBeenCalledWith(expectedKey, {
			options,
		});
	});

	it("mutate function updates the state correctly", async () => {
		const options = { filter: { must: [{ key: "type", match: { value: "image" } }] } };

		const { result } = renderHook(() => useVectorScroll(options));

		const newState: VectorStoreResponse[] = [
			{
				id: "1",
				score: 0.6,
				payload: {
					type: "image",
					id: "some-id",
					content: "",
					language: "en",
					label: "Test",
				},
			},
		];

		act(() => {
			result.current.mutate(() => newState);
		});

		expect(result.current.data).toEqual(newState);
	});

	it("mutate function triggers a new scroll with the same options", async () => {
		const options = { filter: { must: [{ key: "type", match: { value: "image" } }] } };
		const expectedKey = VECTOR_STORE_SCROLL_KEY;

		const { result } = renderHook(() => useVectorScroll(options));

		act(() => {
			result.current.mutate();
		});

		expect(window.ipc.send).toHaveBeenCalledWith(expectedKey, {
			options,
		});
	});
});
