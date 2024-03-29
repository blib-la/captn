import { palette } from "@captn/theme/palette";
import { css, Global } from "@emotion/react";

export const globalStyles = (
	<Global
		styles={css({
			"*": { userSelect: "none" },
			"input, textarea, [contenteditable], select": { userSelect: "unset" },
			":root": {
				"--safe-area-inset-top": "env(safe-area-inset-top)",
				"--safe-area-inset-bottom": "env(safe-area-inset-bottom)",
				"--safe-area-inset-left": "env(safe-area-inset-left)",
				"--safe-area-inset-right": "env(safe-area-inset-right)",
				"--scrollbar-thumb-color": palette.grey["800"],
				"--scrollbar-track-color": "transparent",
				'&[data-joy-color-scheme="dark"]': {
					"--scrollbar-thumb-color": palette.grey["100"],
					"--scrollbar-track-color": "transparent",
				},
			},
			body: { overflowX: "hidden" },
			"#__next": { display: "contents" },
			"::-webkit-scrollbar": {
				width: 6,
				height: 6,
			},
			"::-webkit-scrollbar-thumb": {
				background: "var(--scrollbar-thumb-color)",
			},
			"::-webkit-scrollbar-track": {
				background: "var(--scrollbar-track-color)",
			},
		})}
	/>
);
