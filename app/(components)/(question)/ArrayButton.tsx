import { ComponentProps, useContext } from "react";
import { buttonArrayState } from "./ButtonArray";

export default function ArrayButton({
	label,
	icon,
	disabled,
	persistant,
	...props
}: {
	icon: React.ReactNode;
	persistant?: boolean;
	disabled?: boolean;
	label?: string;
} & ComponentProps<"button">) {
	const hide = useContext(buttonArrayState);

	if (hide && !persistant) {
		return null;
	}

	return (
		<button
			{...props}
			className="flex py-1 px-2 hover:bg-gray-700 rounded-md items-center gap-1"
			disabled={disabled}
		>
			<div className="size-4 text-gray-500">{icon}</div>

			{label && <span className="text-gray-500">{label}</span>}
		</button>
	);
}
