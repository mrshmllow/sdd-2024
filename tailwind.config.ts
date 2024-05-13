import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			screens: {
				print: { raw: "print" },
				// => @media  print { ... }
			},
			colors: {
				gray: {
					900: "#222222",
					800: "#3e3e3e",
					700: "#6f6f6f",
					600: "#8b8b8b",
					500: "#e2e2e2",
					400: "#f6f6f6",
				},
				purple: {
					400: "#fdf4ff",
					500: "#f7d9ff",
					600: "#d150ff",
					700: "#b01fe3",
					800: "#660087",
					900: "#3a004f",
				},
			},
		},
	},
	plugins: [
		require("@tailwindcss/forms"),
		require("@tailwindcss/typography"),
	],
};
export default config;
