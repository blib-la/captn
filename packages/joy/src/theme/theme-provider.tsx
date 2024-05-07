import { CssVarsProvider } from "@mui/joy/styles";
import { ReactNode } from "react";

import { CSS_VARIABLE_PREFIX } from "./constants";
import { theme } from "./theme";

/**
 * ThemeProvider is a component that wraps the CssVarsProvider from MUI Joy, configuring it to use a custom theme.
 * It sets up a CSS variable-based theming solution that automatically handles light/dark modes based on system settings,
 * with the ability to override it via user preferences stored in localStorage.
 *
 * @param {Object} props - The properties passed to the ThemeProvider component.
 * @param {ReactNode} [props.children] - The child components that will inherit the theme. This is typically
 * used at the top level of an app to ensure consistent theming across all child components.
 *
 * The ThemeProvider uses the `theme` object, which should define all the necessary design tokens like
 * colors, typography, etc.
 * It also sets up a localStorage key based on a provided prefix to remember the user's theme preference
 * across sessions.
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children }: { children?: ReactNode }) {
	return (
		<CssVarsProvider
			theme={theme}
			defaultMode="system"
			modeStorageKey={`${CSS_VARIABLE_PREFIX}-mode`}
		>
			{children}
		</CssVarsProvider>
	);
}
