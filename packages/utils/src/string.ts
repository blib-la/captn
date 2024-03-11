/**
 * Parses a given action string into its constituent components: command, captainId, value, and options.
 *
 * The action string is structured to command actions within the application, following the format:
 * - "command:captainId" for actions without additional data.
 * - "command:captainId:value" for actions with data but without options.
 * - "command:captainId:value|options" for actions with both data and options.
 *
 * Here, "captainId" refers to the `data-captainid` attribute of an HTML element, identifying the target for the command.
 *
 * @param {string} action - The action string to be parsed, incorporating the command, target element's captainId, optional value, and optional options.
 * @returns An object containing the parsed parts of the action: { command, captainId, value, options }.
 *   - `command`: The action to perform (e.g., focus, click, type).
 *   - `captainId`: Identifier for the target element (matches `data-captainid` attribute).
 *   - `value`: Optional data relevant to the command (e.g., text to type).
 *   - `options`: Additional parameters or instructions (e.g., "submit" to indicate form submission after typing).
 *
 * @example
 * // Example 1: Focus on an element with specific captainId
 * getActionArguments("focus:color-mode-settings");
 * // Returns: { command: "focus", captainId: "color-mode-settings", value: undefined, options: undefined }
 *
 * @example
 * // Example 2: Click an element with specific captainId
 * getActionArguments("click:language-settings");
 * // Returns: { command: "click", captainId: "language-settings", value: undefined, options: undefined }
 *
 * @example
 * // Example 3: Type into a form and submit
 * getActionArguments("type:feedback-form:this app is amazing|submit");
 * // Returns: { command: "type", captainId: "feedback-form", value: "this app is amazing", options: "submit" }
 */
export function getActionArguments(action: string) {
	// Directly destructure the action string into components,
	// using rest syntax to catch all remaining parts after splitting by ":".
	const [command, captainId, ...rest] = action.split(":");

	// Initialize 'value' and 'options' to undefined for cases where they might not be set.
	let value: string | undefined;
	let options: string | undefined;

	// Check if there are any elements in 'rest', indicating that a 'value' was provided.
	if (rest.length > 0) {
		// The 'value' may contain "|" indicating further options. Split and assign accordingly.
		// Join 'rest' back in case the value contained ":" which was split earlier.
		const lastPart = rest.join(":");
		const parts = lastPart.split("|");

		// Assign 'value' from the first part. If there are options, assign them as well.
		value = parts[0];
		if (parts.length > 1) {
			options = parts.slice(1).join("|"); // Join back any additional "|" split parts as part of options.
		}
	}

	return { command, captainId, value, options } as const;
}