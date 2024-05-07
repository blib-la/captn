import Box from "@mui/joy/Box";
import Sheet, { SheetProps } from "@mui/joy/Sheet";
import { ReactNode } from "react";

/**
 * AppFrame is a functional component that renders a structured layout using Material UI's Joy UI components.
 * It provides a container (Sheet) with configurable color and variant properties, and optionally includes
 * a title bar. The main content area (children) is wrapped in a Box component to ensure proper layout and styling.
 *
 * @param {Object} props - The props passed to the AppFrame component.
 * @param {ReactNode} props.children - The content to be displayed within the main area of the frame.
 * @param {ReactNode} props.titleBar - Optional. A component to be displayed as the title bar of the frame.
 * @param {SheetProps["color"]} props.color - Optional. Defines the color scheme of the frame; it is one of the color options supported by the Sheet component.
 * @param {SheetProps["variant"]} props.variant - Optional. Specifies the variant of the frame, influencing
 * its styling and appearance according to the variant options available in Sheet.
 *
 * The component utilizes the Sheet and Box components from @mui/joy to create a responsive and stylized layout
 * that is suitable for various application interfaces. The use of `invertedColors` and other styling options
 * ensures that the frame can be seamlessly integrated into a diverse range of design themes.
 *
 * @example
 * ```tsx
 * <AppFrame
 *   titleBar={<div>Title Bar</div>}
 *   color="primary"
 *   variant="solid"
 * >
 *   <div>Content goes here</div>
 * </AppFrame>
 * ```
 */
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
