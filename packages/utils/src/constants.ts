export const ERROR_KEY = "ERROR";
export const APP_KEY = "APP";
export const APP_MESSAGE_KEY = `${APP_KEY}:message`;

export const ACTION_KEY = "ACTION";
export const ACTION_RESPONSE_KEY = `${ACTION_KEY}:message`;

export const USER_KEY = "USER";
export const USER_LANGUAGE_KEY = `${USER_KEY}:language`;
export const USER_THEME_KEY = `${USER_KEY}:theme`;

export const VECTOR_STORE_KEY = "VECTOR_STORE";
export const VECTOR_STORE_SAVE_KEY = `${VECTOR_STORE_KEY}:save`;
export const VECTOR_STORE_SAVED_KEY = `${VECTOR_STORE_KEY}:saved`;
export const VECTOR_STORE_SEARCH_KEY = `${VECTOR_STORE_KEY}:search`;
export const VECTOR_STORE_SCROLL_KEY = `${VECTOR_STORE_KEY}:scroll`;
export const VECTOR_STORE_SEARCH_RESULT_KEY = `${VECTOR_STORE_SEARCH_KEY}:result`;
export const VECTOR_STORE_SCROLL_RESULT_KEY = `${VECTOR_STORE_SCROLL_KEY}:result`;

export const INVENTORY_KEY = "INVENTORY";
export const INVENTORY_IMAGES_KEY = `${INVENTORY_KEY}:images`;

export const WINDOW_KEY = "WINDOW";
export const WINDOW_MINIMIZE_KEY = `${WINDOW_KEY}:minimize`;
export const WINDOW_MAXIMIZE_KEY = `${WINDOW_KEY}:maximize`;
export const WINDOW_CLOSE_KEY = `${WINDOW_KEY}:close`;

export const CHILD_KEY = "CHILD";
export const CHILD_OPEN_KEY = `${CHILD_KEY}:open`;
export const CHILD_CLOSE_KEY = `${CHILD_KEY}:close`;
export const CHILD_MAXIMIZE_KEY = `${CHILD_KEY}:maximize`;
export const CHILD_MESSAGE_FROM_PARENT_KEY = `${CHILD_KEY}:message-from-parent`;
export const CHILD_MESSAGE_FROM_CHILD_KEY = `${CHILD_KEY}:message-from-child`;
export const CHILD_MESSAGE_TO_PARENT_KEY = `${CHILD_KEY}:message-to-parent`;
export const CHILD_MESSAGE_TO_CHILD_KEY = `${CHILD_KEY}:message-to-child`;

export const LOCAL_PROTOCOL = "captain-file";
export const DEFAULT_PROTOCOL = "captain";
export const DEFAULT_PROTOCOL_DEVELOPMENT = `${DEFAULT_PROTOCOL}-development`;

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
	 * The download requires a restart.
	 */
	RESTART = "RESTART",

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
	/**
	 * There is an update.
	 */
	UPDATE = "UPDATE",
}
