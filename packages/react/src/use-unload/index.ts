import { useEffect } from "react";

import { useSDK } from "../use-sdk";

/**
 * A custom React hook that sends a specific message using IPC (Inter-Process Communication)
 * when the user attempts to navigate away from the page or close the browser window. This hook is
 * useful for performing clean-up actions or notifying an SDK of app unloading events.
 *
 * @param {string} appId - A unique identifier for the application or SDK instance, used to
 *                         configure the underlying `useSDK` hook for IPC communication.
 * @param {string} action - The action type of the message to be sent on the "beforeunload" event.
 * @param {unknown} [payload=appId] - The payload to be sent with the message. Defaults to the `appId`
 *                                   if no payload is provided.
 *
 * @example
 * ```tsx
 * // Usage within a component to send a 'logout' action when the component is unloaded.
 * const MyApp = () => {
 *   useUnload('myAppId', 'logout');
 *   return <div>My Application</div>;
 * };
 *```
 *
 * @remarks
 * - This hook utilizes the `useSDK` hook to establish IPC communication, ensuring messages
 *   are sent through the proper channels as configured by the `appId`.
 * - The hook automatically adds and removes the event listener for 'beforeunload' to prevent
 *   memory leaks and ensure the message is sent each time the event occurs during the component's
 *   lifecycle.
 * - It's important to note that the `beforeunload` event may not always allow for asynchronous
 *   operations to complete (e.g., network requests), and browsers might limit certain actions
 *   during this event.
 */
export function useUnload(appId: string, action: string, payload: unknown = appId) {
	const { send } = useSDK(appId, {});
	useEffect(() => {
		function beforeUnload() {
			send({ action, payload });
		}

		window.addEventListener("beforeunload", beforeUnload);
		return () => {
			window.removeEventListener("beforeunload", beforeUnload);
		};
	}, [send, payload, action]);
}
