import { useCallback, useRef, useState } from "react";

/**
 * A custom React hook that provides a state variable along with a function to temporarily set its value.
 * After a specified delay, the state automatically resets to its initial value.
 *
 * @template T The type of the state variable.
 * @param initialState The initial value of the state. This is also the value to which the state will reset.
 * @param delay The duration in milliseconds after which the state will reset to the initialState.
 * @returns A tuple containing the current state and a function to set the state temporarily.
 *          The function accepts a new value and after `delay` milliseconds, it resets the state to `initialState`.
 *
 * @example
 * ```ts
 * const [count, setCountTemp] = useResettableState(0, 1000);
 * setCountTemp(5); // Sets count to 5, then resets to 0 after 1000 milliseconds
 * ```
 */
export function useResettableState<T>(initialState: T, delay: number): [T, (value: T) => void] {
	const [state, setState] = useState<T>(initialState);
	const timer = useRef(-1);

	const setTemporaryState = useCallback(
		(value: T) => {
			setState(value);

			timer.current = window.setTimeout(() => {
				setState(initialState);
			}, delay);
		},
		[initialState, delay]
	);

	return [state, setTemporaryState];
}
