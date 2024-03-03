import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import type { SheetProps } from "@mui/joy/Sheet";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import type { ReactNode } from "react";

export function minimize() {
	window.ipc.send("WINDOW:minimize");
}

export function maximize() {
	window.ipc.send("WINDOW:maximize");
}

export function close() {
	window.ipc.send("WINDOW:close");
}

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

export function TitleBar({
	children,
	disableMaximize = false,
	color,
	variant,
}: {
	children?: ReactNode;
	disableMaximize?: boolean;
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
				gridColumnStart: 1,
				gridColumnEnd: 3,
				WebkitAppRegion: "drag",
				alignItems: "center",
			}}
		>
			{children && (
				<Typography level="body-xs" sx={{ pl: 1 }}>
					{children}
				</Typography>
			)}
			<Box sx={{ flex: 1 }} />
			<WindowControls disableMaximize={disableMaximize} />
		</Sheet>
	);
}
