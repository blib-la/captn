import Box from "@mui/joy/Box";
import { styled } from "@mui/joy/styles";
import { CSSProperties, forwardRef, ReactNode } from "react";
import { Scrollbars } from "react-custom-scrollbars";

const StyledScrollbars = styled(Scrollbars)({
	overflow: "hidden",
	"&::-webkit-scrollbar": {
		width: 0,
		height: 0,
	},
});
export const CustomScrollbars = forwardRef<
	Scrollbars,
	{
		style?: CSSProperties;
		children?: ReactNode;
	}
>(({ style, children }, ref) => (
	<StyledScrollbars
		ref={ref}
		autoHide
		universal
		style={{ ...style }}
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
	</StyledScrollbars>
));
