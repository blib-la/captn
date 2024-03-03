import { useCallback, useEffect, useRef } from "react";

import { SDKMessage } from "./types";

/**
 * Provides a React hook for establishing and managing Inter-Process Communication (IPC)
 * with an SDK. This hook enables sending messages to and receiving messages from the SDK,
 * incorporating robust error handling. It abstracts the intricacies of IPC messaging,
 * facilitating communication with minimal setup. React's `useCallback`, `useEffect`,
 * and `useRef` hooks are utilized to maintain an efficient, memory-safe implementation.
 * Error handling is deeply integrated, allowing consumers to appropriately respond to
 * communication issues.
 *
 * @template T - The type of messages being sent to the SDK, constrained to be an object
 * with string keys.
 * @template R - The type of messages expected from the SDK, also constrained to be an
 * object with string keys.
 *
 * @param {string} appId - A unique identifier for the application or SDK instance. This ID
 * is used to construct the IPC channel name, ensuring correct message routing.
 * @param {Object} options - Configuration options for the hook.
 * @param {Function} [options.onMessage] - An optional callback function invoked when a
 * message is received from the SDK. The received message is passed as an argument,
 * allowing the consuming component to process or react to it.
 * @param {Function} [options.onError] - An optional callback function for handling errors
 * that occur during IPC communication, including message sending failures or subscription
 * issues. The error object is passed to this callback.
 *
 * @returns {{ channel: string, send: (message: SDKMessage<T>) => void }}
 * An object containing:
 *  - `channel`: The constructed IPC channel name for debugging or informational purposes.
 *  - `send`: A function to send messages to the SDK. This function is memoized and designed
 *    to internally catch and handle errors, invoking `onError` if provided.
 *
 * @example
 * // Using the `useSDK` hook within a component
 * const App = () => {
 *   const { send } = useSDK("myAppId", {
 *     onMessage: (message) => {
 *       console.log("Received message from SDK:", message.action, message.payload);
 *     },
 *     onError: (error) => {
 *       console.error("An error occurred:", error);
 *     }
 *   });
 *
 *   return (
 *     <button onClick={() => send({ action: "greet", payload: "Hello, SDK!" })}>
 *       Send Message
 *     </button>
 *   );
 * };
 *
 * @remarks
 * - The hook is flexible and easy to integrate, requiring just an `appId` and optional
 *   `onMessage` and `onError` callbacks for setup.
 * - Proper handling of `options.onError` is crucial to ensure errors are not overlooked.
 *   This may involve UI updates, error logging, or other strategies appropriate for the
 *   application context.
 * - The hook manages subscriptions to prevent memory leaks, automatically cleaning up on
 *   component unmount.
 * - While the hook simplifies IPC communication, a basic understanding of IPC mechanisms
 *   is beneficial for effective use and handling potential edge cases or errors.
 */

export function useSDK<T, R>(
	appId: string,
	{
		onMessage,
		onError,
	}: { onMessage?(message: SDKMessage<R>): void; onError?(error: Error): void }
): { channel: string; send: (message: SDKMessage<T>) => void } {
	const onMessageReference = useRef(onMessage);
	const onErrorReference = useRef(onError);

	const channel = `${appId}:APP:message`;

	const send = useCallback(
		(message: SDKMessage<T>) => {
			try {
				window.ipc.send("APP:message", { message, appId });
			} catch (error) {
				if (onErrorReference.current && error instanceof Error) {
					onErrorReference.current(error);
				}
			}
		},
		[appId]
	);

	useEffect(() => {
		onMessageReference.current = onMessage;
	}, [onMessage]);

	useEffect(() => {
		onErrorReference.current = onError;
	}, [onError]);

	useEffect(() => {
		try {
			const unsubscribe = window.ipc.on(channel, (message: SDKMessage<R>) => {
				if (onMessageReference.current) {
					onMessageReference.current(message);
				}
			});
			return () => {
				unsubscribe();
			};
		} catch (error) {
			if (onErrorReference.current && error instanceof Error) {
				onErrorReference.current(error);
			}
		}
	}, [channel]);

	return { channel, send };
}
