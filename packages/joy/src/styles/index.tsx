import { palette } from "@captn/theme/palette";
import { css, Global } from "@emotion/react";

/**
 * Applies global CSS styles across the entire application using the Emotion Global component.
 * This setup includes styles that disable user selection by default to enhance the UI/UX for elements
 * where text selection is not necessary, while specifically enabling user selection for input fields
 * and editable content.
 *
 * Additionally, it defines CSS custom properties for handling safe area insets on modern devices with
 * notches or rounded corners,
 * and customizes the scrollbar appearance to blend seamlessly into the design, providing a tailored
 * scrollbar for both light and dark modes.
 *
 * Usage of globalStyles should be included at the root level of your application to ensure all components
 * inherit these styles.
 */
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
