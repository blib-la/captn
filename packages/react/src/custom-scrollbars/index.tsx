import Box from "@mui/joy/Box";
import { CSSProperties, forwardRef, ReactNode } from "react";
import { Scrollbars } from "react-custom-scrollbars";

export const CustomScrollbars = forwardRef<
	Scrollbars,
	{
		style?: CSSProperties;
		children?: ReactNode;
	}
>(({ style, children }, ref) => (
	<Scrollbars
		ref={ref}
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
));
