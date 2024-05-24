import { isEqual } from "lodash";
import { useCallback, useRef, useState } from "react";

/**
 * A custom React hook to manage state with history, allowing undo, redo, and reset operations.
 *
 * @template T - The type of the state.
 *
 * @param {T} [initialState_] - The initial state value.
 *
 * @returns {[T, (newState: T) => void, Object]} - Returns the current state, a function to update the state,
 * and an object with functions and properties for managing the state history.
 *
 * The returned object contains:
 * - `undo`: A function to revert the state to the previous state.
 * - `redo`: A function to advance the state to the next state, if available.
 * - `reset`: A function to reset the state to the initial state.
 * - `flush`: A function to reset the history, keeping the current state as the only entry.
 * - `hasPast`: A boolean indicating if there is a previous state in the history.
 * - `hasFuture`: A boolean indicating if there is a next state in the history.
 * - `isPresent`: A boolean indicating if the current state is the latest state.
 * - `isPast`: A boolean indicating if the current state is not the latest state.
 * - `initialState`: A boolean indicating if the current state is the initial state.
 * - `historySize`: The total number of states in the history.
 * - `pointerPosition`: The current position in the history.
 * - `canReset`: A boolean indicating if the state can be reset to the initial state.
 * - `modifiedSinceFlush`: A boolean indicating if the state has been modified since the last flush.
 *
 * @example
 * ```js
 * const [state, setState, history] = useHistoryState({ count: 0 });
 *
 * // Update state
 * setState({ count: state.count + 1 });
 *
 * // Undo the last state change
 * history.undo();
 *
 * // Redo the undone state change
 * history.redo();
 *
 * // Reset state to the initial value
 * history.reset();
 *
 * // Flush the history, keeping the current state as the only entry
 * history.flush();
 *
 * // Check if there are past states
 * console.log(history.hasPast); // true or false
 *
 * // Check if there are future states
 * console.log(history.hasFuture); // true or false
 * ```
 */
export function useHistoryState<T>(initialState_?: T) {
	const [state, _setState] = useState<T>(initialState_);
	const [history, setHistory] = useState({
		states: initialState_ ? [initialState_] : [],
		pointer: 0,
		baseState: initialState_,
	});
	const lastFlushedPointer = useRef(0);

	const flush = useCallback(() => {
		// Set the current state as the only entry in the history
		setHistory({
			states: state ? [state] : [],
			pointer: 0,
			baseState: state,
		});
		lastFlushedPointer.current = 0;
	}, [state]);

	const setState = useCallback(
		(newState: T) => {
			if (!isEqual(state, newState)) {
				// Update the state and add it to the history only if the new state is different
				_setState(newState);
				setHistory(previousState => ({
					...previousState,
					states: [...previousState.states.slice(0, previousState.pointer + 1), newState],
					pointer: previousState.pointer + 1,
				}));
			}
		},
		[state, flush]
	);

	const undo = useCallback(() => {
		if (history.pointer > 0) {
			_setState(history.states[history.pointer - 1]);
			setHistory({ ...history, pointer: history.pointer - 1 });
		}
	}, [history]);

	const redo = useCallback(() => {
		if (history.pointer !== history.states.length - 1) {
			_setState(history.states[history.pointer + 1]);
			setHistory({ ...history, pointer: history.pointer + 1 });
		}
	}, [history]);

	const reset = useCallback(() => {
		if (history.baseState) {
			_setState(history.baseState);
			setHistory({ states: [history.baseState], pointer: 0, baseState: history.baseState });
		}
	}, [history]);

	const hasPast = history.pointer > 0;
	const hasFuture = history.pointer < history.states.length - 1;
	const isPresent = history.pointer === history.states.length - 1;
	const isPast = history.pointer < history.states.length - 1;
	const initialState = history.pointer === 0;
	const historySize = history.states.length;
	const pointerPosition = history.pointer;
	const canReset = history.pointer !== 0;
	const modifiedSinceFlush = history.pointer !== lastFlushedPointer.current;

	return [
		state,
		setState,
		{
			undo,
			redo,
			reset,
			flush,
			hasPast,
			hasFuture,
			isPresent,
			isPast,
			initialState,
			historySize,
			pointerPosition,
			canReset,
			modifiedSinceFlush,
		},
	] as const;
}
