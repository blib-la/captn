import { useCallback, useEffect, useRef } from "react";
import { v4 } from "uuid";

import { useResettableState } from "../use-resettable-state";
import { useSDK } from "../use-sdk";

/**
 * A React hook that provides functionality to save an image with an associated prompt to storage via IPC,
 * and it also manages a 'saved' state that resets after a specified delay. This hook listens for a
 * Ctrl+S key event to trigger the image saving process.
 *
 * @param {object} params - The parameters for configuring the hook.
 * @param {string} params.image - The base64 encoded string of the image to be saved.
 * @param {string} params.prompt - The description or prompt associated with the image. This is used
 *                                 as metadata or naming context in the storage.
 * @param {string} params.appId - A unique identifier for the application or SDK instance, used to
 *                                configure the underlying `useSDK` hook for IPC communication.
 * @param {number} [params.resetDelay=2000] - The delay in milliseconds after which the 'saved'
 *                                            state resets to false. Default is 2000 milliseconds.
 *
 * @returns {object} An object containing:
 *  - `saved`: A boolean state that indicates whether the image has been successfully saved.
 *             This state auto-resets after the specified delay.
 *  - `save`: A function that, when executed, saves the current image to storage using IPC
 *            mechanisms and sets the `saved` state to true.
 *
 * @example
 * ```tsx
 * const { saved, save } = useSaveImage({
 *   image: 'data:image/png;base64,...',
 *   prompt: 'A beautiful landscape',
 *   appId: 'myAppId',
 * });
 * if (saved) {
 *   console.log('Image has been saved!');
 * }
 *
 * // The save function can be bound to a button click as well
 * <button onClick={save}>Save Image</button>
 *```
 * @remarks
 * - The hook uses `useSDK` for sending IPC messages to perform file operations, ensuring that the
 *   image data is correctly written to the desired storage location.
 * - The `saved` state provides feedback that can be used to alert users or trigger UI updates
 *   upon successful saving of the image.
 * - Integration with `useResettableState` allows the `saved` state to automatically reset, making
 *   it suitable for transient notifications or indicators.
 * - The hook also sets up a global keyboard listener for the Ctrl+S key combination to provide a
 *   quick save functionality, enhancing usability for keyboard-heavy workflows.
 */
export function useSaveImage({
	image,
	prompt,
	appId,
	resetDelay = 2000,
}: {
	image: string;
	prompt: string;
	appId: string;
	resetDelay?: number;
}) {
	const [saved, setSaved] = useResettableState(false, resetDelay);
	const promptCache = useRef(prompt);
	const imageCache = useRef(image);
	const { writeFile } = useSDK<unknown, string>(appId, {});
	const save = useCallback(async () => {
		const id = v4();
		await writeFile(
			`images/${id}.png`,
			image.split(";base64,").pop()!,
			{
				encoding: "base64",
			},
			promptCache.current
		);

		setSaved(true);
	}, [image, writeFile, setSaved, resetDelay]);

	useEffect(() => {
		if (imageCache.current !== image) {
			promptCache.current = prompt;
		}

		imageCache.current = image;
	}, [image, prompt]);

	useEffect(() => {
		async function handleSave(event: KeyboardEvent) {
			if (event.key === "s" && event.ctrlKey) {
				event.preventDefault();
				await save();
			}
		}

		window.addEventListener("keydown", handleSave);
		return () => {
			window.removeEventListener("keydown", handleSave);
		};
	}, [save]);

	return { saved, save };
}
