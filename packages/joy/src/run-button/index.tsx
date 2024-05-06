import PlayIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";

export interface RunButtonProperties {
	disabled?: boolean;
	isLoading?: boolean;
	isRunning?: boolean;
	labels?: { start?: string; stop?: string };
	onStop(): void;
	onStart(): void;
}

export function RunButton({
	disabled,
	isLoading,
	isRunning,
	onStart,
	onStop,
	labels: { start = "Start", stop = "Stop" } = {},
}: RunButtonProperties) {
	return isRunning ? (
		<Button
			disabled={disabled}
			color="danger"
			variant="soft"
			startDecorator={isLoading ? <CircularProgress /> : <StopIcon />}
			onClick={() => {
				onStop();
			}}
		>
			{stop}
		</Button>
	) : (
		<Button
			disabled={disabled}
			color="success"
			variant="soft"
			startDecorator={isLoading ? <CircularProgress /> : <PlayIcon />}
			onClick={() => {
				onStart();
			}}
		>
			{start}
		</Button>
	);
}
