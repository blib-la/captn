import { useCallback, useState } from "react";

import { useSDK } from "../use-sdk";
import { useUnload } from "../use-unload";

/**
 * A custom React hook for managing the lifecycle and state of a text-to-image generation process
 * via Inter-Process Communication (IPC). This hook facilitates starting, stopping, and managing
 * the image generation process based on text input, utilizing a specific machine learning model.
 *
 * @param {string} appId - A unique identifier for the application or SDK instance, used to
 *                         configure the underlying `useSDK` and `useUnload` hooks for IPC
 *                         communication.
 *
 * @returns {object} An object containing:
 *  - `generate`: A function to trigger the generation of an image from text prompts. Requires
 *                a payload including a 'prompt', 'negative_prompt', and 'seed'.
 *  - `start`: A function to start the image generation process, requiring a payload that specifies
 *             the model and model type.
 *  - `stop`: A function to stop the image generation process.
 *  - `isRunning`: A boolean state indicating if the image generation process is currently active.
 *  - `isLoading`: A boolean state indicating if an operation (start or stop) is in progress.
 *  - `isGenerating`: A boolean state indicating if the image is currently being generated.
 *  - `image`: A state holding the last generated image as a string (e.g., a URL or a base64 encoded string).
 *
 * @remarks
 * - The hook uses `useSDK` for sending and receiving IPC messages specific to image generation tasks.
 * - It listens for specific IPC messages (`text-to-image:started`, `text-to-image:stopped`,
 *   `text-to-image:generated`) to update the state accordingly.
 * - `useUnload` is utilized to ensure that the image generation process is stopped when the component
 *   unmounts or the page is unloaded, preventing unfinished processes from lingering.
 * - Properly handling the `isRunning`, `isLoading`, and `isGenerating` states is crucial for providing
 *   feedback to the user and managing UI components related to the process.
 *
 * @example
 * ```tsx
 * function App () {
 *   const { generate, start, stop, isRunning, isLoading, isGenerating, image } = useTextToImage("myAppId");
 *
 *   return (
 *     <div>
 *       <button onClick={() => start({ model: "modelIdentifier", model_type: "stable-diffusion" })}>
 *         Start Image Generation
 *       </button>
 *       <button onClick={stop} disabled={!isRunning}>
 *         Stop Image Generation
 *       </button>
 *       <button onClick={() => generate({
 *         prompt: "A futuristic cityscape",
 *         negative_prompt: "No people",
 *         seed: 1234
 *       })} disabled={!isRunning || isGenerating}>
 *         Generate Image
 *       </button>
 *       {isLoading && <p>Loading...</p>}
 *       {image && <img src={image} alt="Generated from text" />}
 *     </div>
 *   );
 * };
 * ```
 */
export function useTextToImage(appId: string) {
	const [isRunning, setIsRunning] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const [image, setImage] = useState<string>("");

	const { send } = useSDK<unknown, string>(appId, {
		onMessage(message) {
			switch (message.action) {
				case "text-to-image:started": {
					setIsRunning(true);
					setIsLoading(false);
					break;
				}

				case "text-to-image:stopped": {
					setIsRunning(false);
					setIsLoading(false);
					break;
				}

				case "text-to-image:generated": {
					setIsGenerating(false);
					setImage(message.payload);
					break;
				}

				default: {
					break;
				}
			}
		},
	});

	const start = useCallback(
		(payload: {
			// Example: "stabilityai/stable-diffusion-xl-base-1.0/sd_xl_base_1.0_0.9vae.safetensors"
			model: string;
			model_type: "stable-diffusion-xl" | "stable-diffusion";
		}) => {
			setIsLoading(true);
			send({
				action: "text-to-image:start",
				payload,
			});
		},
		[send]
	);

	const stop = useCallback(() => {
		setIsLoading(true);
		send({ action: "text-to-image:stop", payload: true });
	}, [send]);

	const generate = useCallback(
		(payload: { prompt: string; negative_prompt: string; seed: number }) => {
			if (isRunning) {
				setIsGenerating(true);
				send({
					action: "text-to-image:settings",
					payload,
				});
			}
		},
		[send, isRunning]
	);

	useUnload(appId, "text-to-image:stop");

	return { generate, start, stop, isRunning, isLoading, isGenerating, image };
}
