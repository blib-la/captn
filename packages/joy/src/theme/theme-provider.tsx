import { CssVarsProvider } from "@mui/joy/styles";
import { ReactNode } from "react";

import { CSS_VARIABLE_PREFIX } from "./constants";
import { theme } from "./theme";

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
