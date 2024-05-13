import { createContext } from "react";

export const buttonArrayState = createContext<boolean>(false);

export default function ButtonArray({
	children,
	persistant,
}: {
	children: React.ReactNode;
	persistant?: boolean;
}) {
	return (
		<buttonArrayState.Provider value={persistant ? persistant : false}>
			<div
				className={`absolute ${persistant ? "flex" : "hidden group-hover:flex"} right-2 -bottom-5 bg-gray-800 border-gray-700 border rounded-lg px-1 py-1 text-sm gap-1`}
			>
				{children}
			</div>
		</buttonArrayState.Provider>
	);
}
