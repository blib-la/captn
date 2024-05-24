import { randomSeed } from "@captn/utils/number";
import { renderHook, act } from "@testing-library/react";

import { useSeed } from "../use-seed";

jest.mock("@captn/utils/number", () => ({
	randomSeed: jest.fn(),
}));

describe("useSeed", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should initialize with the given initial seed", () => {
		const { result } = renderHook(() => useSeed(1234));

		expect(result.current.seed).toBe(1234);
		expect(result.current.lastSeed).toBeNull();
	});

	it("should initialize with a default seed of -1 and generate a random seed", () => {
		(randomSeed as jest.Mock).mockReturnValue(5678);

		const { result } = renderHook(() => useSeed());

		expect(result.current.seed).toBe(-1);
		expect(result.current.lastSeed).toBeNull();
	});

	it("should set a new seed value", () => {
		const { result } = renderHook(() => useSeed());

		act(() => {
			result.current.setSeed(4321);
		});

		expect(result.current.seed).toBe(4321);
	});

	it("should generate a new seed if the provided seed is less than 0", () => {
		(randomSeed as jest.Mock).mockReturnValue(5678);

		const { result } = renderHook(() => useSeed());

		act(() => {
			const newSeed = result.current.getNewSeed(-1);
			expect(newSeed).toBe(5678);
		});
	});

	it("should return the provided seed if it is not less than 0", () => {
		const { result } = renderHook(() => useSeed());

		act(() => {
			const newSeed = result.current.getNewSeed(1234);
			expect(newSeed).toBe(1234);
		});
	});

	it("should cache the provided seed as the last used seed", () => {
		const { result } = renderHook(() => useSeed());

		act(() => {
			result.current.cacheSeed(4321);
		});

		expect(result.current.lastSeed).toBe(4321);
	});
});
