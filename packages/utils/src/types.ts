import { DownloadState } from "@captn/utils/constants";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { Schemas as QdrantSchemas } from "@qdrant/js-client-rest";
import type { Except } from "type-fest";

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
	 * Copies an image with additional metadata to the images folder and upserts it in the vector
	 * store to allow retrieval.
	 *
	 * @param {Object} options - The options for copying the file.
	 * @param {string} options.source - The source path of the file to be copied.
	 * @param {string} options.destination - The destination path where the file should be copied.
	 * @param {Object} [options.metadata] - Optional metadata to be associated with the file.
	 * @param {string} [options.metadata.description] - An optional description for the file.
	 * @param {string} [options.metadata.prompt] - An optional prompt associated with the file.
	 * @param {string} [options.metadata.negatrivePrompt] - An optional negative prompt associated with the file.
	 * @param {string} [options.metadata.workflow] - An optional workflow associated with the file.
	 * @param {string} [options.metadata.tags] - Optional tags associated with the file.
	 * @param {string} [options.metadata.caption] - An optional caption for the file.
	 *
	 * @returns {Promise<void | { operation_id?: number | null; status: "acknowledged" | "completed" }[]>} - A promise that resolves when the operation is complete. If successful, it returns an array of objects containing the operation ID and status.
	 */
	copyFileWithMetadata(options: {
		source: string;
		destination: string;
		metadata?: {
			prompt?: string;
			negativePrompt?: string;
			workflow?: string;
			tags?: string;
			description?: string;
			caption?: string;
		};
	}): Promise<
		void | { operation_id?: number | null | undefined; status: "acknowledged" | "completed" }[]
	>;

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

/**
 * Represents an item to be downloaded, including its source, destination, and other metadata.
 */
export interface DownloadItem {
	/**
	 * Unique identifier for each download request.
	 */
	id: string;

	/**
	 * The URL of the file to be downloaded.
	 */
	source: string;

	/**
	 * Local path where the file should be saved.
	 */
	destination: string;

	/**
	 * Name of the downloaded or unpacked file.
	 */
	fileName: string;

	/**
	 * A user-friendly name or label for the download item, for UI display purposes.
	 */
	label: string;

	/**
	 * Time when the download request is sent from the client, represented as a Unix timestamp.
	 */
	createdAt: number;

	/**
	 * MIME type of the file being downloaded, if known beforehand. Optional.
	 */
	mimeType?: string;

	/**
	 * Whether to automatically unzip the file when download completes. Optional.
	 */
	unzip?: boolean;

	/**
	 * Whether the file should be flattened in the directory. If true, the fileName will be used for files or folders. Optional.
	 */
	flat?: boolean;

	/**
	 * Current state of the download. Optional.
	 */
	state?: DownloadState;
}

export type RequiredDownload = Except<DownloadItem, "createdAt">;

/**
 * Defines the structure of a document stored in the vector store, which can represent actions, settings, or any other type of data that needs to be indexed and searchable.
 */
export type VectorStoreDocument = {
	/**
	 * The unique identifier for the document, as set by the database or vector store. This is the primary key used to uniquely identify each document.
	 */
	id?: number | string;

	/**
	 * The main content of the document. This is what will be used for searching and indexing purposes.
	 */
	content: string;

	/**
	 * Additional metadata associated with the document.
	 */
	payload: {
		/**
		 * A unique identifier within the payload, which can be an app ID or a function name.
		 * It serves to identify the app or a specific function within the app, offering a means to reference or invoke it.
		 */
		id: string;

		/**
		 * The language of the document's content. Helps in categorizing documents by language for localization purposes.
		 */
		language: string;

		/**
		 * The unique id of the creator, usually the GitHub name or verified/assigned id.
		 */
		creatorID?: string;

		/**
		 * An optional action associated with the document. This could be an instruction to focus an element, call a function, or perform any other predefined action.
		 */
		action?: string;

		/**
		 * The type of entry that is stored, e.g. app, image, audio.
		 */
		type: string;

		/**
		 * The content that was used to index the document. This might be a snippet if the original content was soo long and split up into smaller parts.
		 */
		content: string;

		/**
		 * An optional URL or path to an icon that represents the document or its action visually. Used in UI elements to enhance user experience.
		 */
		icon?: string;

		/**
		 * An optional color for the background of the icon.
		 */
		iconColor?: string;

		/**
		 * An optional brief description of the document or its action. This can be used in UI elements to provide users with more context.
		 */
		description?: string;

		/**
		 * Optional parameters to be passed if the action is a function call. The function to call is determined by the `payload.id` property.
		 * For example, if `action` is "function" and `payload.id` is "userStore.set", then `parameters` could specify the details of the function call.
		 */
		parameters?: Record<string, unknown>;

		/**
		 * The label or title of the document. Used in search results or UI elements to display a human-readable name for the document.
		 */
		label: string;

		/**
		 * The absolute path to the file.
		 */
		filePath?: string;

		/**
		 * The file type, e.g. jpg, txt.
		 */
		fileType?: string;
	};
};

/**
 * Represents a response from the vector store, extending the information contained within VectorStoreDocument,
 * excluding the 'content' property, and including a 'score' to indicate relevance.
 */
export type VectorStoreResponse = Except<VectorStoreDocument, "content"> & {
	/**
	 * A numerical score indicating the relevance of the document to a search query or action request.
	 * Higher scores indicate greater relevance. The scoring mechanism is determined by the vector store's search algorithm.
	 */
	score: number;
};

/**
 * Defines the options that can be used to customize search behavior in the vector store.
 *
 * This configuration allows clients to set criteria such as minimum score thresholds,
 * which serve to filter search results based on relevance scoring. The options can be
 * expanded to include additional search parameters as needed.
 */
export type SearchOptions = Partial<QdrantSchemas["SearchRequest"]>;

/**
 * Defines the options that can be used to customize scroll behavior in the vector store.
 *
 * This configuration allows clients to set criteria such as ordering,
 * which serve to sort results. The options can be expanded to include additional search parameters
 * as needed.
 */
export type ScrollOptions = Partial<QdrantSchemas["ScrollRequest"]>;

/**
 * Represents the output of an image generation process.
 *
 * @typedef {Object} ImageOutput
 * @property {Object[]} images - Array of generated images.
 * @property {string} images.filename - The filename of the generated image.
 * @property {string} images.subfolder - The subfolder where the generated image is stored.
 */
type ImageOutput = {
	images: { filename: string; subfolder: string }[];
};

/**
 * Represents the structure of a successful execution response from ComfyUI.
 *
 * @interface ComfyUIExecuted
 * @template T - A generic type extending a record with string keys and unknown values, defaults to an empty record.
 * @property {string} type - The type of the response, always "executed" for this interface.
 * @property {Object} data - The data object containing the execution output.
 * @property {T} data.output - The output of the execution.
 */
export interface ComfyUIExecuted<T extends Record<string, unknown> = Record<string, unknown>> {
	type: "executed";
	data: {
		output: T;
		prompt_id: string;
	};
}

/**
 * Represents the structure of an execution-in-progress response from ComfyUI.
 *
 * @interface ComfyUIExecuting
 * @property {string} type - The type of the response, always "executing" for this interface.
 */
export interface ComfyUIExecuting {
	type: "executing";
	data: {
		prompt_id: string;
	};
}

/**
 * Represents the structure of a cached execution response from ComfyUI.
 *
 * @interface ComfyUICached
 * @property {string} type - The type of the response, always "execution_cached" for this interface.
 */
export interface ComfyUICached {
	type: "execution_cached";
	data: {
		prompt_id: string;
	};
}

/**
 * Represents the structure of a status update response from ComfyUI.
 *
 * @interface ComfyUIStatus
 * @property {string} type - The type of the response, always "status" for this interface.
 * @property {Object} data - The data object containing the status information.
 * @property {Object} data.status - The status information object.
 * @property {Object} data.status.exec_info - The execution information object.
 * @property {number} data.status.exec_info.queue_remaining - The number of remaining items in the execution queue.
 */
export interface ComfyUIStatus {
	type: "status";
	data: {
		status: {
			exec_info: {
				queue_remaining: number;
			};
		};
		prompt_id: string;
	};
}

/**
 * Represents a union type for all possible update responses from ComfyUI.
 *
 * @typedef {ComfyUIStatus | ComfyUICached | ComfyUIExecuting | ComfyUIExecuted<ImageOutput>} ComfyUIUpdate
 */
export type ComfyUIUpdate =
	| ComfyUIStatus
	| ComfyUICached
	| ComfyUIExecuting
	| ComfyUIExecuted<ImageOutput>;

/**
 * Represents a basic type for ComfyUI nodes
 */
interface Node<T extends Record<string, unknown> = Record<string, unknown>> {
	inputs: T;
	class_type: string;
	meta?: Record<string, unknown>;
}

/**
 * Represents the node chain as a mapping from string to Node.
 */
export type NodeChain = Record<string, Node>;
