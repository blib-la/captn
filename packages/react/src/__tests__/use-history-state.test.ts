import { renderHook, act } from "@testing-library/react";

import { useHistoryState } from "../use-history-state"; // Adjust the import path as needed

describe("useHistoryState", () => {
	it("should initialize state and history correctly", () => {
		const { result } = renderHook(() => useHistoryState({ count: 0 }));

		const [state, , history] = result.current;

		expect(state).toEqual({ count: 0 });
		expect(history.pointerPosition).toBe(0);
		expect(history.historySize).toBe(1);
		expect(history.initialState).toBe(true);
	});

	it("should update state and history correctly", () => {
		const { result } = renderHook(() => useHistoryState({ count: 0 }));

		act(() => {
			const [, setState] = result.current;
			setState({ count: 1 });
		});

		const [state, , history] = result.current;

		expect(state).toEqual({ count: 1 });
		expect(history.pointerPosition).toBe(1);
		expect(history.historySize).toBe(2);
		expect(history.hasPast).toBe(true);
		expect(history.hasFuture).toBe(false);
	});

	it("should undo state change correctly", () => {
		const { result } = renderHook(() => useHistoryState({ count: 0 }));

		act(() => {
			const [, setState] = result.current;
			setState({ count: 1 });
		});

		act(() => {
			const [, , { undo }] = result.current;
			undo();
		});

		const [state, , history] = result.current;

		expect(state).toEqual({ count: 0 });
		expect(history.pointerPosition).toBe(0);
		expect(history.hasPast).toBe(false);
		expect(history.hasFuture).toBe(true);
	});

	it("should redo state change correctly", () => {
		const { result } = renderHook(() => useHistoryState({ count: 0 }));

		act(() => {
			const [, setState] = result.current;
			setState({ count: 1 });
		});

		act(() => {
			const [, , { undo }] = result.current;
			undo();
		});

		act(() => {
			const [, , { redo }] = result.current;
			redo();
		});

		const [state, , history] = result.current;

		expect(state).toEqual({ count: 1 });
		expect(history.pointerPosition).toBe(1);
		expect(history.hasPast).toBe(true);
		expect(history.hasFuture).toBe(false);
	});

	it("should reset state correctly", () => {
		const { result } = renderHook(() => useHistoryState({ count: 0 }));

		act(() => {
			const [, setState] = result.current;
			setState({ count: 1 });
		});

		act(() => {
			const [, , { reset }] = result.current;
			reset();
		});

		const [state, , history] = result.current;

		expect(state).toEqual({ count: 0 });
		expect(history.pointerPosition).toBe(0);
		expect(history.hasPast).toBe(false);
		expect(history.hasFuture).toBe(false);
	});

	it("should flush state correctly", () => {
		const { result } = renderHook(() => useHistoryState({ count: 0 }));

		act(() => {
			const [, setState] = result.current;
			setState({ count: 1 });
		});

		act(() => {
			const [, , { flush }] = result.current;
			flush();
		});

		const [state, , history] = result.current;

		expect(state).toEqual({ count: 1 });
		expect(history.pointerPosition).toBe(0);
		expect(history.historySize).toBe(1);
		expect(history.hasPast).toBe(false);
		expect(history.hasFuture).toBe(false);
		expect(history.modifiedSinceFlush).toBe(false);
	});
});
