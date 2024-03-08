/**
 * Interface defining the methods available for Inter-Process Communication (IPC) handlers.
 * These methods facilitate file operations, message sending, and event handling between
 * different processes or between a web application and the main electron process.
 */
export interface IPCHandlers {
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
	): Promise<string>;

	/**
	 * Reads the content from a file specified by name.
	 *
	 * @param name - The name or path of the file to read from.
	 * @param encoding - The character encoding to use when reading the file. Defaults to 'utf-8'.
	 * @returns A Promise that resolves to the content of the file as a string.
	 */
	readFile(name: string, encoding?: BufferEncoding): Promise<string>;

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
