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

/**
 * RunButton is a component that toggles between a 'Start' and 'Stop' state with an option to show progress.
 * It provides visual feedback to the user through icons and optional progress indicators, indicating the current
 * state of a process such as starting or stopping an operation.
 *
 * @param {Object} props - The properties passed to the RunButton component.
 * @param {boolean} [props.disabled=false] - If true, the button will be disabled and not clickable.
 * @param {boolean} [props.isLoading=false] - If true, a CircularProgress indicator will be shown on the button,
 * indicating ongoing activity or processing.
 * @param {boolean} [props.isRunning=false] - Determines the state of the button. If true, the button represents a 'Stop'
 * action, otherwise a 'Start' action.
 * @param {Object} [props.labels={ start: "Start", stop: "Stop" }] - Labels for the button in different states.
 * @param {Function} props.onStart - Function to call when the start button is clicked, initiating a process.
 * @param {Function} props.onStop - Function to call when the stop button is clicked, terminating a process.
 *
 * The component switches its appearance and functionality based on the isRunning and isLoading props,
 * showing a play icon for start and a stop icon for stop. It is designed for use in applications where
 * start/stop actions control significant processes, like media playback or task execution.
 *
 * @example
 * ```tsx
 * <RunButton
 *   isRunning={isTaskRunning}
 *   onStart={() => startTask()}
 *   onStop={() => stopTask()}
 *   isLoading={isTaskProcessing}
 *   labels={{ start: "Activate", stop: "Terminate" }}
 * />
 * ```
 * This example sets up a RunButton to control a task, with custom labels for starting and stopping the task.
 */
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
