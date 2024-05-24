export interface Size {
	width: number;
	height: number;
	id: string;
}

function greatestCommonDivisor(a: number, b: number) {
	return b === 0 ? a : greatestCommonDivisor(b, a % b);
}

function getAspectRatioString(width: number, height: number) {
	const divisor = greatestCommonDivisor(width, height);
	return `${width / divisor}:${height / divisor}`;
}

export const sizes: Size[] = [
	{ id: "size_sdxl_01", height: 1536, width: 640 },
	{ id: "size_sdxl_02", height: 1344, width: 768 },
	{ id: "size_sdxl_03", height: 1216, width: 832 },
	{ id: "size_sdxl_04", height: 1152, width: 896 },
	{ id: "size_sdxl_05", height: 1024, width: 1024 },
	{ id: "size_sdxl_06", height: 896, width: 1152 },
	{ id: "size_sdxl_07", height: 832, width: 1216 },
	{ id: "size_sdxl_08", height: 768, width: 1344 },
	{ id: "size_sdxl_09", height: 640, width: 1536 },
	{ id: "size_sd_1-5_01", height: 768, width: 512 },
	{ id: "size_sd_1-5_02", height: 512, width: 768 },
	{ id: "size_sd_1-5_03", height: 512, width: 512 },
];
