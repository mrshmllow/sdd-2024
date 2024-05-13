"use client";

import { PrinterIcon } from "@heroicons/react/24/outline";

export default function PrintButton() {
	return (
		<button
			onClick={(e) => {
				e.preventDefault();
				window.print();
			}}
			className="flex items-center justify-center py-4 bg-gray-400 rounded-lg hover:bg-gray-500 gap-4 transition-colors w-full"
		>
			<PrinterIcon className="size-6" />
			<span>Print</span>
		</button>
	);
}
