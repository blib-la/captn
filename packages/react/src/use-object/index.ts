import isEqual from "lodash.isequal";
import { useDebounce } from "use-debounce";

/**
 * Custom React hook that debounces an object value. This hook is primarily used to limit the rate at
 * which a function that depends on the object's value gets invoked, thereby enhancing performance when
 * tracking object changes in a React component's state or props. The debouncing is handled with both
 * leading and trailing calls, ensuring the value is updated immediately and also after the specified
 * delay if changes continue to occur.
 *
 * The function utilizes lodash's `isEqual` method to perform a deep comparison between the previous
 * and current values, preventing unnecessary updates when the object has not changed meaningfully.
 * This is especially useful when dealing with complex objects that may undergo frequent updates.
 *
 * @template T - A type extending a record of string keys to unknown values, which defines the shape
 * of the object being debounced.
 * @param {T | null} value_ - The object value to debounce. If `null`, the hook behaves as if it were
 * an empty object without properties.
 * @param {number} [delay=300] - The number of milliseconds to delay the debounced value. Defaults to 300ms.
 * @returns {T | null} - Returns the debounced version of the object, adhering to the same structure
 * and types as the input. The returned value updates only when changes are detected post the specified
 * delay, or immediately if specified by the debouncing settings.
 */
export function useObject<T extends Record<string, unknown>>(value_?: T | null, delay = 300) {
	const [debouncedValue] = useDebounce(value_, delay, {
		equalityFn: isEqual,
		leading: true,
		trailing: true,
	});

	return debouncedValue;
}
