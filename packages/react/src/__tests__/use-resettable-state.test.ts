import { renderHook, act } from "@testing-library/react";

import { useResettableState } from "../use-resettable-state";

describe("useResettableState", () => {
	// Enable fake timers
	beforeAll(() => {
		jest.useFakeTimers();
	});

	// Clean up after tests run
	afterAll(() => {
		jest.useRealTimers();
	});

	it("should reset state to initial value after specified delay", () => {
		// Initial values for the test
		const initialValue = 0;
		const temporaryValue = 5;
		const delay = 1000;

		// Render the hook
		const { result } = renderHook(() => useResettableState(initialValue, delay));

		// Check initial state
		expect(result.current[0]).toBe(initialValue);

		// Set temporary state
		act(() => {
			result.current[1](temporaryValue);
		});

		// Check if the state has changed to the temporary value
		expect(result.current[0]).toBe(temporaryValue);

		// Fast-forward time to just before the delay time
		act(() => {
			jest.advanceTimersByTime(delay - 1);
		});

		// Verify that the state has not yet reset
		expect(result.current[0]).toBe(temporaryValue);

		// Fast-forward to complete the delay
		act(() => {
			jest.advanceTimersByTime(1);
		});

		// Check if the state has reset to initial value
		expect(result.current[0]).toBe(initialValue);
	});
});
