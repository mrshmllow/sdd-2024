"use client";

import { ShareIcon } from "@heroicons/react/24/outline";

export default function ShareButton() {
	return (
		<button
			onClick={(e) => {
				e.preventDefault();
				window.navigator.share({
					url: window.location.href,
				});
			}}
			className="flex items-center justify-center py-4 bg-gray-400 rounded-lg hover:bg-gray-500 gap-4 transition-colors w-full"
		>
			<ShareIcon className="size-6" />
			<span>Share</span>
		</button>
	);
}
