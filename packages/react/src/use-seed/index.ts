import { randomSeed } from "@captn/utils/number";
import { useCallback, useState } from "react";

/**
 * Custom hook for managing a seed value with additional utility functions.
 *
 * This hook provides functionality to manage a seed value, generate a new seed, and cache the last used seed.
 * The seed can be initialized with a provided value or defaults to -1, indicating that a new random seed should be generated.
 *
 * @param {number} [initialState=-1] - The initial state of the seed. If the value is less than 0, a new random seed will be generated.
 *
 * @returns {Object} - An object containing the current seed, the last cached seed, and utility functions to manage the seed.
 * @returns {number} seed - The current seed value.
 * @returns {number | null} lastSeed - The last cached seed value, or null if no seed has been cached.
 * @returns {function} getNewSeed - A function that returns a new seed. If the provided seed is less than 0, a random seed is generated.
 * @returns {function} cacheSeed - A function to cache the provided seed as the last used seed.
 * @returns {function} setSeed - A function to set a new seed value.
 *
 * @example
 * const { seed, lastSeed, getNewSeed, cacheSeed, setSeed } = useSeed();
 *
 * // Set a new seed
 * setSeed(1234);
 *
 * // Get a new seed, possibly random
 * const newSeed = getNewSeed(-1);
 *
 * // Cache the current seed
 * cacheSeed(seed);
 *
 * // Access the current and last cached seeds
 * console.log(seed); // 1234
 * console.log(lastSeed); // 1234 (after caching)
 */
export function useSeed(initialState = -1) {
	const [seed, setSeed_] = useState(initialState);
	const [lastSeed, setLastSeed] = useState<null | number>(null);

	const getNewSeed = useCallback((seed_: number) => (seed_ < 0 ? randomSeed() : seed_), []);

	const setSeed = useCallback((seed_: number) => {
		setSeed_(seed_);
	}, []);

	const cacheSeed = useCallback((seed_: number) => {
		setLastSeed(seed_);
	}, []);

	return { seed, lastSeed, getNewSeed, cacheSeed, setSeed };
}
