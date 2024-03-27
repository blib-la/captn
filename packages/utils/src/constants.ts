export const APP_KEY = "APP";
export const APP_MESSAGE_KEY = `${APP_KEY}:message`;

export const ACTION_KEY = "ACTION";
export const ACTION_RESPONSE_KEY = `${ACTION_KEY}:message`;

export const USER_KEY = "USER";
export const USER_LANGUAGE_KEY = `${USER_KEY}:language`;
export const USER_THEME_KEY = `${USER_KEY}:theme`;

export const INVENTORY_KEY = "INVENTORY";
export const INVENTORY_IMAGES_KEY = `${INVENTORY_KEY}:images`;

export const WINDOW_KEY = "WINDOW";
export const WINDOW_MINIMIZE_KEY = `${WINDOW_KEY}:minimize`;
export const WINDOW_MAXIMIZE_KEY = `${WINDOW_KEY}:maximize`;
export const WINDOW_CLOSE_KEY = `${WINDOW_KEY}:close`;

export const LOCAL_PROTOCOL = "captain";

export const DOWNLOADS_KEY = "DOWNLOADS";
export const DOWNLOADS_MESSAGE_KEY = `${DOWNLOADS_KEY}:message`;

export enum DownloadEvent {
	/**
	 * The download has been queued but not yet started.
	 */
	QUEUED = "QUEUED",

	/**
	 * The download is unpacking after completion. Relevant for downloads that need extraction.
	 */
	UNPACKING = "UNPACKING",

	/**
	 * The download process has started.
	 */
	STARTED = "STARTED",

	/**
	 * The download has been canceled by the user.
	 */
	CANCELED = "CANCELED",

	/**
	 * The download has been completed successfully.
	 */
	COMPLETED = "COMPLETED",

	/**
	 * An event indicating progress on the download. This can include percentage complete, bytes downloaded, etc.
	 */
	PROGRESS = "PROGRESS",

	/**
	 * The download has encountered an error and cannot be completed.
	 */
	ERROR = "ERROR",
}

/**
 * Enum representing the possible states of a download process.
 */
export enum DownloadState {
	/**
	 * The download is currently idle.
	 */
	IDLE = "IDLE",

	/**
	 * The download is currently in progress.
	 */
	ACTIVE = "ACTIVE",

	/**
	 * The download has completed successfully.
	 */
	DONE = "DONE",

	/**
	 * The download has encountered an error and did not complete.
	 */
	FAILED = "FAILED",

	/**
	 * The download has been canceled by rhe user and did not complete.
	 */
	CANCELED = "CANCELED",

	/**
	 * The download is being unpacked.
	 */
	UNPACKING = "UNPACKING",
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
	 * Current state of the download. Optional.
	 */
	state?: DownloadState;
}
