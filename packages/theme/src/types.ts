export type Shade = "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
export type ColorShades = Record<Shade, string>;

export interface Palette {
	grey: ColorShades;
	blue: ColorShades;
	teal: ColorShades;
	green: ColorShades;
	lime: ColorShades;
	yellow: ColorShades;
	orange: ColorShades;
	red: ColorShades;
	pink: ColorShades;
	violet: ColorShades;
}
