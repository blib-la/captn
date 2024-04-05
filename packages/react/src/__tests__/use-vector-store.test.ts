import {
	ERROR_KEY,
	VECTOR_STORE_SCROLL_KEY,
	VECTOR_STORE_SCROLL_RESULT_KEY,
	VECTOR_STORE_SEARCH_KEY,
	VECTOR_STORE_SEARCH_RESULT_KEY,
} from "@captn/utils/constants";
import { renderHook } from "@testing-library/react";

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
});
