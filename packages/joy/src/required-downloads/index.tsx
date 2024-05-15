import { useRequiredDownloads } from "@captn/react/use-required-downloads";
import { RequiredDownload } from "@captn/utils/types";
import CheckIcon from "@mui/icons-material/Check";
import DownloadIcon from "@mui/icons-material/Download";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import LinearProgress from "@mui/joy/LinearProgress";
import Typography from "@mui/joy/Typography";
import { useMemo } from "react";

/**
 * RequiredDownloads is a component that manages and displays the download progress of required files for an application.
 * It provides user feedback on the status of each download and a button to initiate the downloading process.
 * The component
 * is intended to ensure all necessary files are downloaded for the application to function properly.
 *
 * @param {Object} props - The properties passed to the RequiredDownloads component.
 * @param {string} [props.note] - Optional custom message to display about the download requirements.
 * @param {boolean} [props.disableTypography] - If true, the note will be displayed as plain text instead of using the Typography component.
 * @param {Function} [props.downloadLabel] - A function that returns a custom label for the download button, receiving the current and total required download counts.
 * @param {Array} props.allRequiredDownloads - An array of objects detailing each required download,
 * including label, id, source, destination, and an optional flag to unzip the downloaded file.
 *
 * This component utilizes the `useRequiredDownloads` hook to track and manage the download states and progress.
 *
 * @example
 * ```tsx
 * <RequiredDownloads
 *   note="Please ensure you download all necessary files to proceed."
 *   allRequiredDownloads={[
 *     { label: 'File 1', id: 'file1', source: '/source/file1.zip', destination: '/destination', unzip: true },
 *     { label: 'File 2', id: 'file2', source: '/source/file2.jpg', destination: '/dest' }
 *   ]}
 * />
 * ```
 */
export function RequiredDownloads({
	note,
	disableTypography,
	allRequiredDownloads,
	downloadLabel = (downloadCount, requiredCount) =>
		`Download (${downloadCount} of ${requiredCount})`,
}: {
	note?: string;
	disableTypography?: boolean;
	downloadLabel?(doneCount: number, requiredCount: number): string;
	allRequiredDownloads: RequiredDownload[];
}) {
	const { download, isCompleted, isDownloading, percent, downloadCount, requiredDownloads } =
		useRequiredDownloads(allRequiredDownloads);

	const message = useMemo(() => {
		let note_ = note;
		if (!note_) {
			const names = allRequiredDownloads.map(({ label }) => label).join(", ");
			note_ = `This app requires ${names}.`;
		}

		return note_;
	}, [note]);

	return (
		!isCompleted && (
			<Box sx={{ px: 1, py: 2, position: "fixed", bottom: 0, right: 0, m: 1 }}>
				{disableTypography ? message : <Typography>{message}</Typography>}
				<Button
					disabled={isDownloading || isCompleted}
					startDecorator={isCompleted ? <CheckIcon /> : <DownloadIcon />}
					onClick={download}
				>
					<Box sx={{ pb: 1 }}>
						{downloadLabel(downloadCount, requiredDownloads.length)}
					</Box>

					<LinearProgress
						determinate={isDownloading || isCompleted}
						value={isDownloading || isCompleted ? percent * 100 : 0}
						sx={{
							position: "absolute",
							left: 0,
							right: 0,
							bottom: 0,
							"--LinearProgress-radius": "0px",
							"--LinearProgress-thickness": "8px",
						}}
					/>
				</Button>
			</Box>
		)
	);
}
