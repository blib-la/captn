import { useRequiredDownloads } from "@captn/react/use-required-downloads";
import CheckIcon from "@mui/icons-material/Check";
import DownloadIcon from "@mui/icons-material/Download";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import LinearProgress from "@mui/joy/LinearProgress";
import Typography from "@mui/joy/Typography";
import { useMemo } from "react";

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
	allRequiredDownloads: {
		label: string;
		id: string;
		source: string;
		destination: string;
		unzip?: boolean;
	}[];
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
