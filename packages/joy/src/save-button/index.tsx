import { useSaveImage } from "@captn/react/use-save-image";
import CheckIcon from "@mui/icons-material/Check";
import SaveIcon from "@mui/icons-material/Save";
import Button from "@mui/joy/Button";

/**
 * SaveButton is a component that provides an interface for saving an image with associated metadata.
 * It uses the `useSaveImage` hook to manage the save state and trigger the save operation. The button's
 * appearance and label change based on whether the image has been saved or not.
 *
 * @param {Object} props - The properties passed to the SaveButton component.
 * @param {string} props.image - The URL or path to the image that needs to be saved.
 * @param {string} props.prompt - A description or metadata associated with the image to be saved.
 * @param {string} props.appId - An identifier for the application or context in which the image is saved.
 * @param {Object} [props.labels={ save: "Save", saved: "Saved" }] - Labels for the button in different states,
 * providing customization for the save and saved states.
 *
 * This component displays a button that, when clicked, will save the image and its metadata using the provided
 * application identifier. It reflects the save state by changing its color and icon: a check icon and success color
 * when saved, and a save icon with a neutral color when not yet saved.
 *
 * @example
 * ```tsx
 * <SaveButton
 *   image="path/to/image.jpg"
 *   prompt="A beautiful scenery"
 *   appId="myApp123"
 *   labels={{ save: "Custom Save", saved: "Custom Saved" }}
 * />
 * ```
 * This setup will render a SaveButton that allows users to save an image with a custom label, changing upon saving.
 */
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
