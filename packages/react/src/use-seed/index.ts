import { randomSeed } from "@captn/utils/number";
import { useCallback, useState } from "react";

export function useSeed(initialState = -1) {
	const [seed, setSeed] = useState(initialState);
	const [lastSeed, setLastSeed] = useState<null | number>(null);

	const getSeed = useCallback((seed_: number) => {
		const newSeed = seed_ < 0 ? randomSeed() : seed_;
		setSeed(newSeed);
		return newSeed;
	}, []);

	const cacheSeed = useCallback((seed_: number) => {
		setLastSeed(seed_);
	}, []);

	return { seed, lastSeed, getSeed, cacheSeed };
}
