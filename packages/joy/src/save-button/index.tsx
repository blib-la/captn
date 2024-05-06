import { useSaveImage } from "@captn/react/use-save-image";
import CheckIcon from "@mui/icons-material/Check";
import SaveIcon from "@mui/icons-material/Save";
import Button from "@mui/joy/Button";

export function SaveButton({
	image,
	prompt,
	appId,
	labels: { save: saveLabel = "Save", saved: savedLabel = "Saved" } = {},
}: {
	image: string;
	prompt: string;
	appId: string;
	labels?: { save?: string; saved?: string };
}) {
	const { saved, save } = useSaveImage({ image, prompt, appId });

	return (
		<Button
			color={saved ? "success" : "neutral"}
			variant="soft"
			startDecorator={saved ? <CheckIcon /> : <SaveIcon />}
			onClick={save}
		>
			{saved ? savedLabel : saveLabel}
		</Button>
	);
}
