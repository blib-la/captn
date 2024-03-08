import Box from "@mui/joy/Box";
import Sheet, { SheetProps } from "@mui/joy/Sheet";
import { ReactNode } from "react";

export function AppFrame({
	children,
	titleBar,
	color,
	variant,
}: {
	children?: ReactNode;
	titleBar?: ReactNode;
	color?: SheetProps["color"];
	variant?: SheetProps["variant"];
}) {
	return (
		<Sheet
			invertedColors
			color={color}
			variant={variant}
			sx={{
				position: "absolute",
				inset: 0,
				display: "flex",
				flexDirection: "column",
			}}
		>
			{titleBar}
			<Box sx={{ flex: 1, position: "relative" }}>{children}</Box>
		</Sheet>
	);
}
