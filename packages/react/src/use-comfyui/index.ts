import { ComfyUIUpdate, NodeChain } from "@captn/utils/types";
import { useCallback, useEffect, useRef, useState } from "react";

import { StableDiffusion, useInventory } from "../use-inventory";
import { useSDK } from "../use-sdk";
import { useUnload } from "../use-unload";

/**
 * A hook to interact with the ComfyUI application. This hook manages the state of the image generation queue,
 * interacts with the Stable Diffusion inventory, and handles message communication with the SDK.
 *
 * @param {string} appId - The ID of the application using the ComfyUI.
 * @param {(image: string, meta: { filename: string; subfolder: string }) => void} onGenerated - A callback function that gets called when an image is generated. It receives the generated image's temporary URL and metadata.
 *
 * @returns {Object} - An object containing the following properties and functions:
 *   - `models`: An object containing arrays of different model types (loras, checkpoints, vae, upscalers) from the Stable Diffusion inventory.
 *   - `generate`: A function to queue an image generation workflow.
 *   - `isGenerating`: A boolean indicating if an image is currently being generated.
 *   - `image`: A string URL of the currently generated image.
 *   - `queueSize`: A number indicating the current size of the image generation queue.
 *
 * @example
 * ```tsx
 * const { models, generate, isGenerating, image, queueSize } = useComfyUI(appId, (image, meta) => {
 *   console.log("Generated image:", image, "with metadata:", meta);
 * });
 *
 * // To generate an image:
 * generate("workflow_string_here");
 *
 * // To access models:
 * console.log(models.loras, models.checkpoints, models.vae, models.upscalers);
 *
 * // To check if an image is being generated:
 * console.log(isGenerating);
 *
 * // To access the currently generated image:
 * console.log(image);
 *
 * // To check the size of the generation queue:
 * console.log(queueSize);
 * ```
 */
export function useComfyUI(
	appId: string,
	onGenerated: (
		_image: string,
		meta: { filename: string; subfolder: string; prompt: string }
	) => void
) {
	const [queueSize, setQueueSize] = useState(0);
	const [isGenerating, setIsGenerating] = useState(false);
	const [image, setImage] = useState<string | null>(null);
	const { data: inventoryData } = useInventory<StableDiffusion>("stable-diffusion");
	const history = useRef<Record<string, string>>({});

	const loras = inventoryData?.loras ?? [];
	const checkpoints = inventoryData?.checkpoints ?? [];
	const vae = inventoryData?.vae ?? [];
	const upscalers = inventoryData?.upscalers ?? [];

	const { send } = useSDK<unknown, object>(appId, {
		async onMessage(message) {
			switch (message.action) {
				case "comfyui:promptId": {
					try {
						const { promptId, workflow } = message.payload as unknown as {
							promptId: string;
							workflow: NodeChain;
						};
						history.current[promptId] = workflow.prompt.inputs.text as string;
						console.log(history);
					} catch {}

					break;
				}

				case "comfyui:update": {
					const { data, comfyUITemporaryPath } = message.payload as {
						data: ComfyUIUpdate;
						comfyUITemporaryPath: string;
					};
					if (data.type === "status") {
						setQueueSize(data.data.status.exec_info.queue_remaining);
						setIsGenerating(data.data.status.exec_info.queue_remaining > 0);
					} else if (data.type === "executed") {
						const { filename, subfolder } = data.data.output.images[0];
						const promptId = data.data.prompt_id;
						const prompt = history.current[promptId];
						const temporaryImage =
							`${comfyUITemporaryPath}/${subfolder}/${filename}`.replaceAll(
								/\?+/g,
								"/"
							);
						setImage(temporaryImage);
						onGenerated(temporaryImage, { filename, subfolder, prompt });
					}

					break;
				}

				default: {
					break;
				}
			}
		},
	});

	const generate = useCallback(
		(workflow: NodeChain) => {
			setIsGenerating(true);

			send({
				action: "comfyui:queue",
				payload: {
					workflow,
				},
			});
		},
		[send]
	);

	useUnload(appId, "comfyui:unregisterClient", {});

	useEffect(() => {
		send({
			action: "comfyui:registerClient",
			payload: {},
		});
		return () => {
			send({
				action: "comfyui:unregisterClient",
				payload: {},
			});
		};
	}, [send]);

	return {
		models: {
			loras,
			checkpoints,
			vae,
			upscalers,
		},
		generate,
		isGenerating,
		image,
		queueSize,
	};
}
