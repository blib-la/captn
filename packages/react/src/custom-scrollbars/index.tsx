import Box from "@mui/joy/Box";
import type { CSSProperties, ReactNode } from "react";
import { Scrollbars } from "react-custom-scrollbars";

export function CustomScrollbars({
	style,
	children,
}: {
	style?: CSSProperties;
	children?: ReactNode;
}) {
	return (
		<Scrollbars
			autoHide
			universal
			style={{ ...style, overflow: "hidden" }}
			renderThumbVertical={properties => (
				<Box
					{...properties}
					className="thumb-vertical"
					sx={theme => ({
						bgcolor: "text.secondary",
						zIndex: theme.zIndex.badge + 1,
					})}
				/>
			)}
		>
			{children}
		</Scrollbars>
	);
}
