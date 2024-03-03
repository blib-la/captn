export interface SDKMessage<T> {
	action: string;
	payload: T;
}

declare global {
	interface Window {
		ipc: {
			send(channel: string, value?: unknown): void;
			on(channel: string, callback: (...args: any[]) => void): () => void;
		};
	}
}
