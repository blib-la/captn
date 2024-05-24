import { APP_MESSAGE_KEY } from "@captn/utils/constants";
import { IPCHandlers } from "@captn/utils/types";
import { useCallback, useEffect, useRef } from "react";

import { SDKMessage } from "../types";

/**
 * Provides a React hook for establishing and managing Inter-Process Communication (IPC)
 * with an SDK. This hook facilitates sending messages to and receiving messages from the SDK,
 * handling files, and navigating directories, thereby incorporating robust error handling and
 * abstracting the intricacies of IPC messaging for minimal setup. React's `useCallback`,
 * `useEffect`, and `useRef` hooks are utilized to ensure an efficient, memory-safe implementation.
 * Error handling is deeply integrated, enabling consumers to appropriately respond to communication
 * and operation issues.
 *
 * @template T - The type of messages being sent to the SDK, constrained to be an object
 * with string keys.
 * @template R - The type of messages expected from the SDK, also constrained to be an
 * object with string keys.
 *
 * @param {string} appId - A unique identifier for the application or SDK instance. This ID
 * is used to construct the IPC channel name, ensuring correct message routing.
 * @param {Object} options - Configuration options for the hook, including callbacks for
 * message reception and error handling.
 * @param {Function} [options.onMessage] - An optional callback function invoked when a
 * message is received from the SDK. The received message is passed as an argument,
 * allowing the consuming component to process or react to it.
 * @param {Function} [options.onError] - An optional callback function for handling errors
 * that occur during IPC communication or file operations, including message sending failures,
 * subscription issues, or file operation errors. The error object is passed to this callback.
 *
 * @returns  An object containing:
 *  - `channel`: The constructed IPC channel name for debugging or informational purposes.
 *  - `send`: A function to send messages to the SDK. This function is memoized and designed
 *    to internally catch and handle errors, invoking `onError` if provided.
 *  - `getFilePath`: A function to get the path of a specific file, leveraging the IPC mechanism.
 *  - `getDirectoryPath`: A function to get the path of a specific directory, leveraging the IPC mechanism.
 *  - `readFile`: A function to read the content of a file, encapsulating the IPC file reading capabilities.
 *  - `writeFile`: A function to write content to a file, encapsulating the IPC file writing capabilities.
 *
 * @example
 * // Using the `useSDK` hook within a component
 * const App = () => {
 *   const { send, readFile, writeFile } = useSDK("myAppId", {
 *     onMessage: (message) => {
 *       console.log("Received message from SDK:", message.action, message.payload);
 *     },
 *     onError: (error) => {
 *       console.error("An error occurred:", error);
 *     }
 *   });
 *
 *   // Example usage of readFile and writeFile
 *   const handleFileOperations = async () => {
 *     try {
 *       const filePath = await writeFile('test.txt', 'Hello SDK!', { encoding: 'utf8' });
 *       const content = await readFile(filePath, 'utf8');
 *       console.log('File content:', content);
 *     } catch (error) {
 *       console.error('File operation error:', error);
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={() => send({ action: "greet", payload: "Hello, SDK!" })}>
 *         Send Message
 *       </button>
 *       <button onClick={handleFileOperations}>
 *         Test File Operations
 *       </button>
 *     </div>
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
 *   and file operations is beneficial for effective use and handling potential edge cases
 *   or errors.
 */
export function useSDK<T, R>(
	appId: string,
	{
		onMessage,
		onError,
	}: { onMessage?(message: SDKMessage<R>): void; onError?(error: Error): void }
): {
	channel: string;
	send(message: SDKMessage<T>): void;
	getFilePath: IPCHandlers["getFilePath"];
	getDirectoryPath: IPCHandlers["getDirectoryPath"];
	copyFileWithMetadata: IPCHandlers["copyFileWithMetadata"];
	readFile: IPCHandlers["readFile"];
	writeFile: IPCHandlers["writeFile"];
} {
	const onMessageReference = useRef(onMessage);
	const onErrorReference = useRef(onError);

	const channel = `${appId}:${APP_MESSAGE_KEY}`;

	const send = useCallback(
		(message: SDKMessage<T>) => {
			try {
				window.ipc.send(APP_MESSAGE_KEY, { message, appId });
			} catch (error) {
				if (onErrorReference.current && error instanceof Error) {
					onErrorReference.current(error);
				}
			}
		},
		[appId]
	);

	const copyFileWithMetadata = useCallback(
		(options: {
			source: string;
			destination: string;
			metadata?: { prompt?: string; description?: string; caption?: string };
		}) => window.ipc.copyFileWithMetadata(options),
		[]
	);
	const getFilePath = useCallback(() => window.ipc.getFilePath(), []);
	const getDirectoryPath = useCallback(() => window.ipc.getDirectoryPath(), []);
	const readFile = useCallback(
		(name: string, encoding?: BufferEncoding) => window.ipc.readFile(name, encoding),
		[]
	);
	const writeFile = useCallback(
		(name: string, content: string, options: { encoding?: BufferEncoding }, context?: string) =>
			window.ipc.writeFile(name, content, options, context),
		[]
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

	return {
		channel,
		send,
		getFilePath,
		getDirectoryPath,
		readFile,
		writeFile,
		copyFileWithMetadata,
	};
}
