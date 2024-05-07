import { USER_THEME_KEY } from "@captn/utils/constants";
import { useEffect, useRef } from "react";

/**
 * A custom React hook that subscribes to theme changes within the application and executes a callback
 * function when the theme changes. This hook manages the lifecycle of theme-related event listeners,
 * ensuring that the most current callback is used and properly cleaned up when the component unmounts
 * or the callback changes.
 *
 * The hook listens for theme changes through an IPC event defined by `USER_THEME_KEY`. It supports
 * themes specified as "light", "dark", or "system", providing flexibility in responding to changes
 * in the user's preferred theme settings in a dynamic environment, such as an Electron application.
 *
 * @param {Function} callback - A callback function that is called with the new theme setting ("light",
 * "dark", or "system") as its argument whenever the theme setting changes. This function can perform
 * any actions needed in response to a theme change, such as updating state or UI elements to reflect
 * the new theme.
 *
 * Usage:
 * This hook is typically used in components that need to react to changes in the user's theme
 * settings, ensuring that the application's UI is always in sync with the user's preferences. It
 * abstracts the complexity of subscribing to and handling IPC events, making it easier to implement
 * theme-aware components.
 */
export function useTheme(callback: (theme: "light" | "dark" | "system") => void) {
	const callbackReference = useRef(callback);

	useEffect(() => {
		callbackReference.current = callback;
	}, [callback]);

	useEffect(() => {
		const unsubscribe = window.ipc?.on(
			USER_THEME_KEY,
			(theme?: "light" | "dark" | "system") => {
				if (theme) {
					callbackReference.current(theme);
				}
			}
		);
		return () => {
			if (unsubscribe) {
				unsubscribe();
			}
		};
	}, []);
}
