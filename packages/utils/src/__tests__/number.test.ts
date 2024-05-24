import { randomSeed } from "../number";

describe("randomSeed", () => {
	it("should generate a seed between 1 and 4294967296 inclusive", () => {
		const seed = randomSeed();

		// Check if the seed is within the expected range
		expect(seed).toBeGreaterThanOrEqual(1);
		expect(seed).toBeLessThanOrEqual(4294967296);
	});

	it("should generate different seeds on subsequent calls", () => {
		let seed1: number;
		let seed2: number;
		const retries = 3;
		let differentSeeds = false;

		for (let i = 0; i < retries; i++) {
			seed1 = randomSeed();
			seed2 = randomSeed();

			// If we get different seeds, we can stop retrying
			if (seed1 !== seed2) {
				differentSeeds = true;
				break;
			}
		}

		// Check if the seeds are different after retries
		expect(differentSeeds).toBe(true);
	});
});
