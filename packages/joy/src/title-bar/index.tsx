import { WINDOW_CLOSE_KEY, WINDOW_MAXIMIZE_KEY, WINDOW_MINIMIZE_KEY } from "@captn/utils/constants";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import type { SheetProps } from "@mui/joy/Sheet";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import type { ReactNode } from "react";

/**
 * Minimizes the current window.
 * This function sends a command to the main process via IPC to minimize the application window.
 * It uses a specific IPC channel denoted by WINDOW_MINIMIZE_KEY.
 *
 * @example
 * ```tsx
 * <button onClick={minimize}>Minimize Window</button>
 * ```
 */
export function minimize() {
	window.ipc.send(WINDOW_MINIMIZE_KEY);
}

/**
 * Maximizes the current window.
 * This function sends a command to the main process via IPC to maximize the application window.
 * It is useful when the application needs to toggle between normal and maximized window states.
 * The specific IPC channel used is denoted by WINDOW_MAXIMIZE_KEY.
 *
 * @example
 * ```tsx
 * <button onClick={maximize}>Maximize Window</button>
 * ```
 */
export function maximize() {
	window.ipc.send(WINDOW_MAXIMIZE_KEY);
}

/**
 * Closes the current window.
 * This function sends a command to the main process via IPC to close the application window.
 * It leverages the WINDOW_CLOSE_KEY channel for IPC communication, ensuring the command is
 * handled appropriately by the main process.
 *
 * @example
 * ```tsx
 * <button onClick={close}>Close Window</button>
 * ```
 */
export function close() {
	window.ipc.send(WINDOW_CLOSE_KEY);
}

/**
 * WindowControls is a component that provides user interface controls for window operations such as minimize, maximize, and close.
 * It renders a set of buttons that interact with the system window, using IPC commands to perform their respective actions.
 *
 * @param {Object} props - The properties passed to the WindowControls component.
 * @param {boolean} [props.disableMaximize=true] - If true, disables the maximize button, preventing the window from being maximized.
 * @param {Object} [props.labels={}] - An optional set of labels to provide accessible aria-labels for each control button. This includes labels for minimize, maximize, and close buttons.
 *
 * Each button is equipped with an icon representing its action, and the close button includes additional styling for hover and active states to indicate a dangerous action visually.
 *
 * @example
 * ```tsx
 * <WindowControls
 *   labels={{ minimize: "Minimize Window", maximize: "Maximize Window", close: "Close Window" }}
 * />
 * ```
 */
export function WindowControls({
	disableMaximize = true,
	labels = {},
}: {
	disableMaximize?: boolean;
	labels?: { minimize?: string; maximize?: string; close?: string };
}) {
	return (
		<Box sx={{ WebkitAppRegion: "no-drag", "--focus-outline-offset": "-2px" }}>
			<IconButton aria-label={labels.minimize} sx={{ cursor: "default" }} onClick={minimize}>
				<RemoveIcon sx={{ fontSize: 16 }} />
			</IconButton>
			<IconButton
				disabled={disableMaximize}
				aria-label={labels.maximize}
				sx={{ cursor: "default" }}
				onClick={maximize}
			>
				<CheckBoxOutlineBlankIcon sx={{ fontSize: 16 }} />
			</IconButton>
			<IconButton
				aria-label={labels.close}
				sx={{
					cursor: "default",
					"&:hover, &:focus-visible": {
						bgcolor: "danger.500",
						color: "common.white",
					},
					"&:active ": {
						bgcolor: "danger.600",
						color: "common.white",
					},
				}}
				onClick={close}
			>
				<CloseIcon sx={{ fontSize: 16 }} />
			</IconButton>
		</Box>
	);
}

/**
 * TitleBar is a component designed to provide a customizable title bar for application windows.
 * It integrates with system window controls to manage window actions like minimize, maximize, and close,
 * and supports optional typography for title display. The component is styled using Sheet from MUI Joy,
 * allowing for theming consistency and visual customization.
 *
 * @param {Object} props - The properties passed to the TitleBar component.
 * @param {ReactNode} [props.children] - The content to be displayed within the title bar, typically the
 * title text or any custom elements.
 * @param {boolean} [props.disableMaximize=false] - If true, the maximize button within the window controls
 * will be disabled.
 * @param {boolean} [props.disableTypography=false] - If true, the children will be rendered as-is without
 * any additional typography styling.
 * @param {SheetProps["color"]} [props.color] - Optional. The color of the title bar, influencing the background
 * color according to the Sheet component's theme.
 * @param {SheetProps["variant"]} [props.variant] - Optional. The variant of the styling applied to the title bar,
 * as defined by the Sheet component's theme.
 *
 * This component is ideal for applications where the title bar requires specific interaction handling or
 * when there is a need for a more sophisticated title bar arrangement beyond standard text display.
 *
 * @example
 * ```jsx
 * <TitleBar color="primary" variant="soft">
 *   My Application
 * </TitleBar>
 * ```
 * This example renders a TitleBar with a primary color theme and soft variant, displaying 'My Application' as the title.
 */
export function TitleBar({
	children,
	disableMaximize = false,
	disableTypography,
	color,
	variant,
}: {
	children?: ReactNode;
	disableMaximize?: boolean;
	disableTypography?: boolean;
	color?: SheetProps["color"];
	variant?: SheetProps["variant"];
}) {
	return (
		<Sheet
			invertedColors
			color={color}
			variant={variant}
			sx={{
				display: "flex",
				WebkitAppRegion: "drag",
				alignContent: disableTypography ? undefined : "center",
				alignItems: disableTypography ? undefined : "center",
			}}
		>
			{children &&
				(disableTypography ? (
					<Box sx={{ display: "flex", flex: 1, px: 1 }}>{children}</Box>
				) : (
					<Typography level="body-xs" sx={{ flex: 1, px: 1 }}>
						{children}
					</Typography>
				))}
			<WindowControls disableMaximize={disableMaximize} />
		</Sheet>
	);
}
