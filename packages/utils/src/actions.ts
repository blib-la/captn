/**
 * Executes a specified action on an HTML element identified by its `data-captainid` attribute.
 *
 * This function aims to abstract the common pattern of querying an element by its `data-captainid`
 * and then performing some action on that element. It uses `CSS.escape` to ensure that the captainId
 * is safely used in a query selector, protecting against CSS injection vulnerabilities and syntax errors
 * due to special characters.
 *
 * @param {string} captainId - The unique identifier associated with the element's `data-captainid` attribute.
 * @param {(element: HTMLElement) => void} action - A callback function that performs an operation on the found element.
 * The action is only executed if the element is successfully queried from the DOM.
 *
 * @example
 * // Focuses an element with `data-captainid="username-input"`
 * performElementAction("username-input", (el) => el.focus());
 *
 * @example
 * // Clicks a button with `data-captainid="submit-button"`
 * performElementAction("submit-button", (el) => el.click());
 *
 * @throws {Error} Logs an error to the console if the element cannot be found or if the action throws an error.
 */
export function performElementAction(captainId: string, action: (element: HTMLElement) => void) {
	try {
		const selector = `[data-captainid="${CSS.escape(captainId)}"]`;
		const element = document.querySelector<HTMLElement>(selector);
		if (element) {
			action(element);
		}
	} catch (error) {
		console.error(`Error performing action on element with captainId=${captainId}:`, error);
	}
}
