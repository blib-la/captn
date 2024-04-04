import { DownloadItem } from "@captn/utils/constants";
import { Except } from "type-fest";

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
	downloadStore: {
		/**
		 * Retrieves a value of type T from the download store identified by a unique key.
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
		 * // Retrieve a download status, with a default value of IDLE if not found
		 * downloadStore.get<string>('https://huggingface.co/Blib-la/sd-turbo-fp16', 'IDLE').then((status) => {
		 *   console.log(status);
		 * });
		 */
		get<T>(key: string, defaultValue?: T): Promise<T>;
	};
	/**
	 * Writes content to a file specified by name. If the file does not exist, it will be created. This function also
	 * accepts a context parameter for storing text in a vector store, allowing for easier lookup of files based on content.
	 *
	 * @param name - The name or path of the file where content is to be written.
	 * @param content - The content to write to the file.
	 * @param options - Optional settings that configure the writing process. Includes:
	 *  - `encoding`: The character encoding for the file. Defaults to 'utf-8'.
	 * @param context - Optional string representing the context or metadata associated with the content, used for indexing in a vector store.
	 * @returns A Promise that resolves to the path of the written file, along with the file type.
	 */
	writeFile(
		name: string,
		content: string,
		options: { encoding?: BufferEncoding },
		context?: string
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
	 * Initiates the download of one or more files based on the provided data array.
	 * Each object in the array represents a download task with its own source, destination,
	 * and other optional parameters. The method processes these tasks to initiate downloads,
	 * potentially unzipping the files upon completion if specified.
	 *
	 * This updated interface and method reflect the capability to handle multiple downloads,
	 * where each task is defined by its source URL, destination path, unique identifier,
	 * and an optional unzip flag. It's designed to support bulk operations,
	 * allowing for efficient management of multiple file downloads with individual tracking and processing.
	 *
	 * @param {Object[]} data - An array of objects, where each object contains:
	 *   @property {string} source - The URL from which the file will be downloaded.
	 *   @property {string} destination - The local file system path where the downloaded file will be saved.
	 *   @property {string} id - A unique identifier for the download task. This is used to track the download's progress and status.
	 *   @property {boolean} [unzip=false] - Optional. Indicates whether the downloaded file should be automatically unzipped after download.
	 * @returns {Promise<void>} A promise that resolves when all download tasks have been processed, either successfully or with errors.
	 */
	downloadFiles(
		data: {
			label: string;
			id: string;
			appId: string;
			source: string;
			destination: string;
			unzip?: boolean;
		}[]
	): Promise<void>;

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

export type RequiredDownload = Except<DownloadItem, "createdAt">;
