import {
	VECTOR_STORE_SEARCH_KEY,
	VECTOR_STORE_SCROLL_KEY,
	VECTOR_STORE_SCROLL_RESULT_KEY,
	ERROR_KEY,
	VECTOR_STORE_SEARCH_RESULT_KEY,
} from "@captn/utils/constants";
import type { SearchOptions, ScrollOptions, VectorStoreResponse } from "@captn/utils/types";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import { useObject } from "../use-object";

/**
 * Custom React hook to interact with the vector store, providing search functionality.
 *
 * This hook manages a search query against a vector store, debouncing the input value to avoid
 * excessive querying. It sends the debounced query to the vector store and manages the state of
 * the search results, providing real-time feedback as the user types.
 *
 * @param {string} query The initial search query string.
 * @param {SearchOptions} [{ score_threshold }={}] The search options including score threshold to filter the results.
 * @returns {VectorStoreResponse[]} The search results as an array of VectorStoreResponse objects.
 *
 * @example
 * ```ts
 * // In a React component
 * const searchResults = useVectorStore('search term', { score_threshold: 0.5 });
 * // searchResults will contain an array of search responses where each item has a score above 0.5
 * ```
 */
export function useVectorStore(
	query: string,
	{ score_threshold, filter, limit }: SearchOptions = {}
) {
	const [query_] = useDebounce(query, 300, { leading: true, trailing: true });
	const [data, setData] = useState<VectorStoreResponse[]>([]); // State to store the search results
	const [error, setError] = useState<Error | null>(null);
	const filter_ = useObject(filter, 100);

	useEffect(() => {
		if (query_?.trim()) {
			// Only proceed with a non-empty query
			window.ipc.send(VECTOR_STORE_SEARCH_KEY, {
				query: query_,
				options: { score_threshold, limit, filter: filter_ },
			});
		} else {
			setData([]);
		}
	}, [query_, score_threshold, filter_, limit]);

	useEffect(() => {
		const unsubscribeResult = window.ipc.on(VECTOR_STORE_SEARCH_RESULT_KEY, data_ => {
			setData(data_);
		});
		const unsubscribeError = window.ipc.on(ERROR_KEY, error => {
			setError(new Error(error));
		});

		return () => {
			unsubscribeResult();
			unsubscribeError();
		};
	}, []);

	return { data, error };
}

/**
 * Custom React hook to interact with the vector store for scrolling through large datasets.
 *
 * This hook manages the state of scrolling operations within a vector store, sending scroll
 * parameters to the vector store and managing the state of the scroll results. It provides a
 * continuous way to retrieve large sets of results where the dataset is too large to feasibly
 * return at once, using debounced filter settings to minimize unnecessary queries.
 *
 * @param {ScrollOptions} [{ order_by, with_payload, limit, filter }={}] The scrolling options
 * including ordering, payload inclusion, limit, and filtering criteria to tailor the scroll results.
 * @returns {{ data: VectorStoreResponse[], error: Error | null }} An object containing an array of
 * VectorStoreResponse objects representing the scroll results, and an error object if an error occurs.
 *
 * @example
 * ```ts
 * // In a React component
 * const { data, error } = useVectorScroll({ order_by: 'date', limit: 10 });
 * // data will contain an array of VectorStoreResponses, each representing a chunk of the vector store data
 * ```
 */
export function useVectorScroll({ order_by, with_payload, limit, filter }: ScrollOptions = {}) {
	const [data, setData] = useState<VectorStoreResponse[]>([]); // State to store the search results
	const [error, setError] = useState<Error | null>(null);
	const filter_ = useObject(filter, 1000);

	useEffect(() => {
		window.ipc.send(VECTOR_STORE_SCROLL_KEY, {
			options: { order_by, with_payload, limit, filter: filter_ },
		});
	}, [order_by, with_payload, filter_, limit]);

	useEffect(() => {
		const unsubscribeResult = window.ipc.on(VECTOR_STORE_SCROLL_RESULT_KEY, data_ => {
			setData(data_);
		});
		const unsubscribeError = window.ipc.on(ERROR_KEY, error => {
			setError(new Error(error));
		});

		return () => {
			unsubscribeResult();
			unsubscribeError();
		};
	}, []);

	return { data, error };
}
