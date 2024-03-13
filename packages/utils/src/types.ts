/**
 * Interface defining the methods available for Inter-Process Communication (IPC) handlers.
 * These methods facilitate file operations, message sending, and event handling between
 * different processes or between a web application and the main electron process.
 */
export interface IPCHandlers {
	inventoryStore: {
		/**
		 * Retrieves a value of type T from the inventory store identified by a unique key.
		 * If the key is not found, an optional default value may be returned instead.
		 * This method returns a promise that resolves to the value associated with the key
		 * or the default value.
		 *
		 * @template T - The expected type of the value associated with the key.
		 * @param {string} key - The unique key identifying the value to retrieve.
		 * @param {T} [defaultValue] - An optional default value to return if the key is not found.
		 * @returns {Promise<T>} - A promise that resolves with the retrieved value or the default value.
		 *
		 * @example
		 * // Retrieve an item count, with a default value of 0 if not found
		 * inventoryStore.get<number>('itemCount', 0).then((count) => {
		 *   console.log(count); // Outputs: the retrieved count or 0
		 * });
		 */
		get<T>(key: string, defaultValue?: T): Promise<T>;
	};
	/**
	 * Writes content to a file specified by name. If the file does not exist, it will be created.
	 *
	 * @param name - The name or path of the file where content is to be written.
	 * @param content - The content to write to the file.
	 * @param options - Optional settings that configure the writing process. Includes:
	 *  - `encoding`: The character encoding for the file. Defaults to 'utf-8'.
	 * @returns A Promise that resolves to the path of the written file.
	 */
	writeFile(
		name: string,
		content: string,
		options: { encoding?: BufferEncoding }
	): Promise<{ filePath: string; fileType: string }>;

	/**
	 * Reads the content from a file specified by name.
	 *
	 * @param name - The name or path of the file to read from.
	 * @param encoding - The character encoding to use when reading the file. Defaults to 'utf-8'.
	 * @returns A Promise that resolves to the content of the file as a string.
	 */
	readFile(name: string, encoding?: BufferEncoding): Promise<string>;

	/**
	 * Copies a file from a source path to a destination path. If the destination file exists, it will be overwritten.
	 *
	 * @param source - The name or path of the source file to copy from.
	 * @param destination - The name or path of the destination file to copy to.
	 * @returns A Promise that resolves when the file has been successfully copied. The promise does not resolve to any value.
	 *
	 * @example
	 * // Copy a file from 'path/to/source.txt' to 'path/to/destination.txt'
	 * copyFile('path/to/source.txt', 'path/to/destination.txt')
	 *   .then(() => console.log('File copied successfully'))
	 *   .catch(error => console.error('Error copying file:', error));
	 */
	copyFile(source: string, destination: string): Promise<void>;

	/**
	 * Retrieves the path to the directory selected by the user.
	 *
	 * @returns A Promise that resolves to the path of the selected directory.
	 */
	getDirectoryPath(): Promise<string>;

	/**
	 * Retrieves the path to the file selected by the user.
	 *
	 * @returns A Promise that resolves to the path of the selected file.
	 */
	getFilePath(): Promise<string>;

	/**
	 * Sends a message to a specified channel. Useful for sending data or notifications to other
	 * processes or the main process.
	 *
	 * @param channel - The name of the channel to send the message to.
	 * @param value - The message or data to send. Can be of any type.
	 */
	send(channel: string, value?: unknown): void;

	/**
	 * Registers an event listener for messages sent on a specific channel.
	 *
	 * @param channel - The name of the channel to listen for messages on.
	 * @param callback - The function to call when a message is received. The function is
	 *                   passed the message as its arguments.
	 * @returns A function that, when called, will unsubscribe the event listener.
	 */
	on(channel: string, callback: (...args: any[]) => void): () => void;
}

// Extend the Window interface to include the ipc property for accessing IPC handlers.
declare global {
	interface Window {
		/**
		 * Property providing access to IPC handlers within the context of the global window object.
		 * Enables invoking IPC methods for file operations, messaging, and event handling directly from
		 * a web application's frontend code.
		 */
		ipc: IPCHandlers;
	}
}
