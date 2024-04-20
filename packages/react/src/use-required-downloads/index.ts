import { DownloadEvent, DOWNLOADS_MESSAGE_KEY, DownloadState } from "@captn/utils/constants";
import { RequiredDownload } from "@captn/utils/types";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getProperty } from "dot-prop";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Custom React hook for managing and tracking required downloads within an application.
 * It allows for initiating downloads, monitoring download progress, and checking completion status
 * for a predefined set of downloads. This hook leverages the Electron IPC mechanism to communicate
 * with the main process for file operations, ensuring that required files are downloaded and available
 * for use within the application.
 *
 * The hook encapsulates the logic for:
 * - Adding downloads to a queue based on a list of required downloads.
 * - Initiating the download process for each item in the queue.
 * - Monitoring the progress of each download and updating the state accordingly.
 * - Determining when all required downloads have been completed.
 *
 * It maintains internal state to track the number of downloads, their cumulative progress,
 * and whether the download process is active or completed. This state can be accessed via
 * the returned object, allowing the consuming component to react to changes in the download
 * process, display progress to the user, or trigger additional actions once downloads are complete.
 *
 * @param {RequiredDownload[]} requiredDownloads_ - An array of objects, each representing a download
 *                                                  task with properties such as source URL, destination
 *                                                  path, and unique identifier.
 *
 * @returns {object} An object containing the following properties:
 *  - {boolean} isCompleted - A boolean flag indicating whether all required downloads have been completed.
 *  - {boolean} isDownloading - A boolean flag indicating whether the download process is currently active.
 *  - {number} downloadCount - The number of downloads that have been completed.
 *  - {number} percent - The current progress percentage of the ongoing download task. This is a cumulative
 *                       value if multiple downloads are being processed.
 *  - {RequiredDownload[]} requiredDownloads - An array of download tasks that are yet to be completed.
 *  - {Function} download - A function to initiate the download process for the required files.
 *
 * @example
 * // Define a list of required downloads for your application.
 * const requiredDownloads = [
 *   {
 *     id: 'unique-download-id-1',
 *     source: 'https://example.com/file1.zip',
 *     destination: 'path/to/save',
 *     label: 'File 1',
 *   },
 *   {
 *     id: 'unique-download-id-2',
 *     source: 'https://example.com/file2.zip',
 *     destination: 'path/to/save',
 *     label: 'File 2',
 *   }
 * ];
 *
 * // Use the hook in your component to manage these downloads.
 * const {
 *   isCompleted,
 *   isDownloading,
 *   downloadCount,
 *   percent,
 *   requiredDownloads,
 *   download,
 * } = useRequiredDownloads(requiredDownloads);
 *
 * // Initiate the download process.
 * useEffect(() => {
 *   if (!isCompleted && requiredDownloads.length > 0) {
 *     download();
 *   }
 * }, [isCompleted, requiredDownloads, download]);
 *
 * // Render progress or completion state to the user.
 * return (
 *   <div>
 *     {isDownloading && <p>Downloading: {percent}% completed</p>}
 *     {isCompleted && <p>All downloads completed!</p>}
 *   </div>
 * );
 */

export function useRequiredDownloads(requiredDownloads_: RequiredDownload[]) {
	const requiredDownloadsReference = useRef(requiredDownloads_);
	const [downloadCount, setDownloadCount] = useState(0);
	const [percent, setPercent] = useState(0);
	const [isDownloading, setIsDownloading] = useState(false);
	const [requiredDownloads, setRequiredDownloads] = useState<RequiredDownload[]>([]);
	const requiredDownloadsLength = requiredDownloads.length;
	const [isCompleted, setIsCompleted] = useState(downloadCount >= requiredDownloadsLength);

	const download = useCallback(async () => {
		if (!window.ipc) {
			return;
		}

		setIsDownloading(true);
		for (const download of requiredDownloads) {
			window.ipc.send(DOWNLOADS_MESSAGE_KEY, {
				action: "download",
				payload: {
					...download,
					createdAt: Date.now(),
				},
			});
		}
	}, [requiredDownloads]);

	useEffect(() => {
		if (downloadCount >= requiredDownloadsLength) {
			setIsCompleted(true);
			setIsDownloading(false);
		} else {
			setIsCompleted(false);
		}
	}, [downloadCount, requiredDownloadsLength]);

	useEffect(() => {
		if (!window.ipc) {
			return;
		}

		for (const requiredDownload of requiredDownloadsReference.current) {
			const keyPath = requiredDownload.destination.replaceAll("/", ".");
			const downloadKeyPath = [requiredDownload.destination, requiredDownload.id]
				.join("/")
				.replaceAll("/", ".");

			window.ipc.inventoryStore
				.get<
					{
						id: string;
						modelPath: string;
						label: string;
					}[]
				>(keyPath)
				.then(value => {
					if (!value || !value.some(({ id }) => id === requiredDownload.id)) {
						setRequiredDownloads(previousState => {
							const exists = previousState.some(
								({ id }) => id === requiredDownload.id
							);
							if (exists) {
								return previousState;
							}

							return [...previousState, requiredDownload];
						});
					}
				});
			window.ipc.downloadStore.get<DownloadState | undefined>(downloadKeyPath).then(value => {
				if (value && [DownloadState.ACTIVE, DownloadState.UNPACKING].includes(value)) {
					setIsDownloading(true);
				}
			});
		}

		const unsubscribeDownload = window.ipc.on(DOWNLOADS_MESSAGE_KEY, message => {
			const isRequiredDownload = requiredDownloadsReference.current.some(
				download => download.id === message.payload.id
			);
			if (!isRequiredDownload) {
				return;
			}

			switch (message.action) {
				case DownloadEvent.COMPLETED: {
					setDownloadCount(previousState => previousState + 1);
					setPercent(1);
					break;
				}

				case DownloadEvent.STARTED: {
					setPercent(0);
					break;
				}

				case DownloadEvent.PROGRESS: {
					setPercent(message.payload.percent ?? 0);
					break;
				}

				default: {
					break;
				}
			}
		});

		const unsubscribeAllInventory = window.ipc.on(
			"allInventory",
			(inventory: Record<string, unknown>) => {
				const done = requiredDownloadsReference.current.every(item => {
					const keyPath = item.destination.replaceAll("/", ".");
					const inventoryCollection = getProperty<
						Record<string, unknown>,
						string,
						{
							id: string;
						}[]
					>(inventory, keyPath);
					if (Array.isArray(inventoryCollection)) {
						return inventoryCollection.some(
							inventoryItem => inventoryItem.id === item.id
						);
					}

					return false;
				});
				setIsCompleted(done);
			}
		);

		Promise.all(
			requiredDownloadsReference.current.map(async requiredDownload => {
				const keyPath = requiredDownload.destination.replaceAll("/", ".");
				const value = await window.ipc.inventoryStore.get<
					{
						id: string;
						modelPath: string;
						label: string;
					}[]
				>(keyPath);
				return value?.some(({ id }) => id === requiredDownload.id);
			})
		).then(results => {
			setIsCompleted(results.every(Boolean));
		});
		for (const requiredDownload of requiredDownloadsReference.current) {
			const keyPath = requiredDownload.destination.replaceAll("/", ".");
			window.ipc.inventoryStore
				.get<
					{
						id: string;
						modelPath: string;
						label: string;
					}[]
				>(keyPath)
				.then(value => {
					if (value?.some(({ id }) => id === requiredDownload.id)) {
						console.log(requiredDownload.id);
					}
				});
		}

		return () => {
			unsubscribeDownload();
			unsubscribeAllInventory();
		};
	}, []);

	return { isCompleted, isDownloading, downloadCount, percent, requiredDownloads, download };
}
