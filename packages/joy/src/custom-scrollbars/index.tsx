import Box from "@mui/joy/Box";
import { styled } from "@mui/joy/styles";
import { CSSProperties, forwardRef, ReactNode } from "react";
import { ScrollbarProps, Scrollbars } from "react-custom-scrollbars";
import { Except } from "type-fest";

const StyledScrollbars = styled(Scrollbars)({
	overflow: "hidden",
	"&::-webkit-scrollbar, ::-webkit-scrollbar": {
		width: 0,
		height: 0,
	},
});

/**
 * CustomScrollbars is a component that encapsulates the `react-custom-scrollbars` library,
 * providing a stylized scrollbar experience. It uses Material UI's Joy styling system to
 * apply custom styles, including a hidden default scrollbar track to enforce the custom styles.
 *
 * The scrollbar automatically hides when inactive and supports universal rendering environments,
 * making it suitable for both client and server-side rendering scenarios. The thumb of the
 * scrollbar (the draggable element within the scrollbar's track) is also styled according to the
 * theme specified in the Material UI theme provider.
 *
 * @param {Object} props - The props passed to the CustomScrollbars component.
 * @param {CSSProperties} props.style - Optional. Custom style properties to apply to the scrollbar container.
 * @param {ReactNode} props.children - Optional. The content to be rendered within the scrollable area.
 * @param {React.Ref<Scrollbars>} ref - A ref that provides access to the Scrollbars instance,
 * allowing for direct manipulation of the scrollbar (e.g., scrolling programmatically).
 *
 * @example
 * ```jsx
 * <CustomScrollbars style={{ height: 300 }}>
 *   <div>Scrollable content here</div>
 * </CustomScrollbars>
 * ```
 * This example sets a fixed height for the scrollbar area and includes some content that exceeds
 * the height of the container, making the scrollbar functional.
 */
export const CustomScrollbars = forwardRef<
	Scrollbars,
	{
		style?: CSSProperties;
		children?: ReactNode;
	} & Except<ScrollbarProps, "universal" | "autoHide" | "ref" | "as">
>(({ children, ...properties }, ref) => (
	<StyledScrollbars
		ref={ref}
		{...properties}
		autoHide
		universal
		renderThumbVertical={properties => (
			<Box
				{...properties}
				style={{ ...properties.style, width: 10 }}
				sx={theme => ({
					bgcolor: "text.secondary",
					zIndex: theme.zIndex.badge + 1,
				})}
			/>
		)}
		renderThumbHorizontal={properties => (
			<Box
				{...properties}
				style={{ ...properties.style, height: 10 }}
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

CustomScrollbars.displayName = "CustomScrollbars";
