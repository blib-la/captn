import isEqual from "lodash.isequal";
import { useDebounce } from "use-debounce";

export function useObject<T extends Record<string, unknown>>(value_?: T | null, delay = 300) {
	const [debouncedValue] = useDebounce(value_, delay, {
		equalityFn: isEqual,
		leading: true,
		trailing: true,
	});

	return debouncedValue;
}
