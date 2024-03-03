// preload.d.ts
declare global {
	interface Window {
		ipc: {
			send(channel: string, value?: unknown): void;
			on(channel: string, callback: (...args: any[]) => void): () => void;
		};
	}
}

export {};