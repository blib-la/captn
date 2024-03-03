import { createGetCssVar } from "@mui/joy/styles/extendTheme";

import { CSS_VARIABLE_PREFIX } from "./constants";

export const getCssVariable = createGetCssVar(CSS_VARIABLE_PREFIX);
