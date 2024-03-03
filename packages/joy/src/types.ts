import type { PaletteRange } from "@mui/joy/styles";

declare global {
	interface Window {
		ipc: {
			send(channel: string, value?: unknown): void;
			on(channel: string, callback: (...args: any[]) => void): () => void;
		};
	}
}

declare module "@mui/joy/styles" {
	interface ColorPalettePropOverrides {
		secondary: true;
		grey: true;
		blue: true;
		teal: true;
		green: true;
		lime: true;
		yellow: true;
		orange: true;
		red: true;
		pink: true;
		violet: true;
	}

	interface Palette {
		secondary: PaletteRange & { softActiveColor?: string };
		grey: PaletteRange & { softActiveColor?: string };
		blue: PaletteRange & { softActiveColor?: string };
		teal: PaletteRange & { softActiveColor?: string };
		green: PaletteRange & { softActiveColor?: string };
		lime: PaletteRange & { softActiveColor?: string };
		yellow: PaletteRange & { softActiveColor?: string };
		orange: PaletteRange & { softActiveColor?: string };
		red: PaletteRange & { softActiveColor?: string };
		pink: PaletteRange & { softActiveColor?: string };
		violet: PaletteRange & { softActiveColor?: string };
	}
}
