import type { SWRConfiguration } from "swr";
import useSWR from "swr";

/**
 * Represents an inventory item with an ID, file path, model path, and label.
 *
 * @interface Inventory
 * @property {string} id - The unique identifier of the inventory item.
 * @property {string} filePath - The file path of the inventory item.
 * @property {string} modelPath - The model path of the inventory item.
 * @property {string} label - The label of the inventory item.
 */
export interface Inventory {
	id: string;
	filePath: string;
	modelPath: string;
	label: string;
}

/**
 * Represents the structure for Stable Diffusion inventory items, which may include checkpoints, loras, vae, and upscalers.
 *
 * @interface StableDiffusion
 * @property {Inventory[]} [checkpoints] - An array of checkpoint inventory items.
 * @property {Inventory[]} [loras] - An array of lora inventory items.
 * @property {Inventory[]} [vae] - An array of VAE inventory items.
 * @property {Inventory[]} [upscalers] - An array of upscaler inventory items.
 */
export interface StableDiffusion {
	checkpoints?: Inventory[];
	loras?: Inventory[];
	vae?: Inventory[];
	upscalers?: Inventory[];
}

/**
 * A custom hook to retrieve items stored in the inventory store, such as Stable Diffusion configurations, apps, datasets, etc.
 *
 * @function useInventory
 * @template T - The type of the data being retrieved from the inventory store.
 *
 * @param {string} key - The key to identify which item to retrieve from the inventory store.
 * @param {SWRConfiguration<T>} [config] - Optional configuration for the SWR hook.
 *
 * @returns {SWRResponse<T, any>} - The response object from the SWR hook, containing the data, error, and status of the fetch request.
 *
 * @example
 * ```js
 * const { data, error } = useInventory<StableDiffusion>('stable-diffusion-config');
 *
 * if (error) return <div>Error loading inventory</div>;
 * if (!data) return <div>Loading...</div>;
 *
 * return (
 *   <div>
 *     <h1>Stable Diffusion Inventory</h1>
 *     <pre>{JSON.stringify(data, null, 2)}</pre>
 *   </div>
 * );
 * ```
 */
export function useInventory<T>(key: string, config?: SWRConfiguration<T>) {
	return useSWR(
		key,
		async () => {
			const data = await window.ipc.inventoryStore.get<T>(key);
			if (data) {
				return data;
			}

			throw new Error(`data not found for key: ${key}`);
		},
		config
	);
}
