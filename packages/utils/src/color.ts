/**
 * Determines the best contrast color (black or white) for a given hex color.
 * The decision is based on the luminance of the provided hex color.
 *
 * @param hexColor - The hex color code as a string (e.g., "#ffffff" or "#000").
 * @returns A string indicating the contrast color, either "black" or "white".
 *
 * @example
 * getContrastColor("#ffffff"); // Returns "black"
 * getContrastColor("#000000"); // Returns "white"
 */
export function getContrastColor(hexColor: string): string {
	const [red, green, blue] = hexToRGB(hexColor);
	const luminance = Math.trunc(0.299 * red + 0.587 * green + 0.114 * blue);
	return luminance > 128 ? "black" : "white";
}

/**
 * Calculates the relative luminance of an RGB color, which is a measure of the
 * intensity of the light that a color produces. It is used in calculating contrast
 * ratios and adheres to the WCAG 2.1 guidelines.
 *
 * @param rgb - An array containing the red, green, and blue components of the color, each ranging from 0 to 255.
 * @returns The relative luminance, a number between 0 (darkest) and 1 (lightest).
 *
 * @example
 * getRelativeLuminance([255, 255, 255]); // Returns 1
 * getRelativeLuminance([0, 0, 0]); // Returns 0
 */
export function getRelativeLuminance(rgb: [number, number, number]): number {
	const [r, g, b] = rgb.map(channel => channel / 255);

	const [R, G, B] = [r, g, b].map((channel: number) =>
		channel <= 0.039_28 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
	);
	return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Converts a hex color code to its RGB components.
 *
 * @param hex - The hex color code as a string (e.g., "#ffffff").
 * @returns An array of three numbers representing the RGB components of the color.
 * @throws {Error} If the provided string is not a valid hex color code.
 *
 * @example
 * hexToRGB("#ffffff"); // Returns [255, 255, 255]
 * hexToRGB("#000"); // Returns [0, 0, 0]
 */
export function hexToRGB(hex: string): [number, number, number] {
	const shorthandRegex = /^#?([\da-f])([\da-f])([\da-f])$/i;
	hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

	const result = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex);
	if (!result) {
		throw new Error("Invalid HEX color.");
	}

	return [
		Number.parseInt(result[1], 16),
		Number.parseInt(result[2], 16),
		Number.parseInt(result[3], 16),
	];
}

/**
 * Converts RGB components to a hex color code.
 *
 * @param r - The red component of the color, ranging from 0 to 255.
 * @param g - The green component of the color, ranging from 0 to 255.
 * @param b - The blue component of the color, ranging from 0 to 255.
 * @returns The hex color code as a string (e.g., "#ffffff").
 * @throws {Error} If any of the RGB values are outside the 0 to 255 range.
 *
 * @example
 * rgbToHex(255, 255, 255); // Returns "#ffffff"
 * rgbToHex(0, 0, 0); // Returns "#000000"
 */
export function rgbToHex(r: number, g: number, b: number) {
	if (![r, g, b].every(value => value >= 0 && value <= 255)) {
		throw new Error("Invalid RGB value.");
	}

	return (
		"#" +
		[r, g, b]
			.map(x => {
				const hex = x.toString(16);
				return hex.length === 1 ? "0" + hex : hex;
			})
			.join("")
	);
}

/**
 * Mixes two colors in a given proportion.
 *
 * @param color1 - The first color as a hex string.
 * @param color2 - The second color as a hex string.
 * @param percentage - The proportion of the second color in the mix, ranging from 0 to 1.
 * @returns The resulting color as a hex string.
 *
 * @example
 * mixColors("#ffffff", "#000000", 0.5); // Returns "#808080" (a shade of gray)
 */
export function mixColors(color1: string, color2: string, percentage: number) {
	percentage = Math.max(0, Math.min(percentage, 1));

	const [r1, g1, b1] = hexToRGB(color1);
	const [r2, g2, b2] = hexToRGB(color2);

	const r = Math.round(r1 + (r2 - r1) * percentage);
	const g = Math.round(g1 + (g2 - g1) * percentage);
	const b = Math.round(b1 + (b2 - b1) * percentage);

	return rgbToHex(r, g, b);
}

/**
 * Calculates the contrast ratio between two colors according to WCAG guidelines.
 * It also determines if the contrast ratio meets AA or AAA levels for accessibility.
 *
 * @param background - The background color as a hex string.
 * @param foreground - The foreground color as a hex string.
 * @returns An object containing the contrast ratio and boolean values indicating if the
 *          contrast meets AA and AAA levels.
 *
 * @example
 * getContrast("#ffffff", "#000000");
 * // Returns { contrast: 21, aa: true, aaa: true }
 */
export function getContrast(background: string, foreground: string) {
	const luminance1 = getRelativeLuminance(hexToRGB(background));
	const luminance2 = getRelativeLuminance(hexToRGB(foreground));

	const contrast =
		luminance1 > luminance2
			? (luminance1 + 0.05) / (luminance2 + 0.05)
			: (luminance2 + 0.05) / (luminance1 + 0.05);

	return {
		contrast,
		aa: contrast >= 4.5,
		aaa: contrast >= 7,
	};
}
