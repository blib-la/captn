import { USER_LANGUAGE_KEY } from "@captn/utils/constants";
import { useEffect, useRef } from "react";

/**
 * A custom React hook that subscribes to language changes within the application and executes a callback
 * function when the language changes. This hook ensures that the callback function has the most current
 * reference through the use of a ref, and it handles cleanup by unsubscribing from the event listener
 * when the component unmounts.
 *
 * The hook listens for changes to the user's language setting through an IPC event identified by
 * `USER_LANGUAGE_KEY`. It is designed for use in environments where language settings can change
 * dynamically and need to be responded to in real-time, such as in desktop applications built with Electron.
 *
 * @param {Function} callback - A callback function that is called with the new language string as its
 * argument whenever the language setting changes. This function can perform any actions needed in
 * response to a language change, such as updating state or UI elements.
 *
 * Usage:
 * This hook is used in components that need to react to changes in the user's language setting. It
 * abstracts the complexity of subscribing to and handling IPC events, making it easier to implement
 * responsive, i18n-aware components.
 */
export function useLanguage(callback: (language: string) => void) {
	const callbackReference = useRef(callback);

	useEffect(() => {
		callbackReference.current = callback;
	}, [callback]);

	useEffect(() => {
		const unsubscribe = window.ipc?.on(USER_LANGUAGE_KEY, (language: string) => {
			callbackReference.current(language);
		});
		return () => {
			if (unsubscribe) {
				unsubscribe();
			}
		};
	}, []);
}
