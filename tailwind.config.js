import { heroui } from '@heroui/react'

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}',
		'./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'
	],
	theme: {
		extend: {}
	},
	darkMode: 'class',
	plugins: [
		heroui({
			prefix: 'heroui',
			addCommonColors: false,
			themes: {
				dark: {
					layout: {},
					colors: {}
				},
				light: {
					extend: 'light',
					layout: {},
					colors: {
						background: '#ffffff',
						background2: '#1B1B1B',
						content1: '#ffffff',
						// content2: ColorScale;
						// content3: ColorScale;
						// content4: ColorScale;
						primary: {
							50: '#f3ffe0',
							100: '#dffcb4',
							200: '#cbf985',
							300: '#b7f756',
							400: '#a3f52a',
							500: '#89db14',
							600: '#6bab0d',
							700: '#4c7a06',
							800: '#2c4900',
							900: '#0c1900',

							DEFAULT: '#cbf985',
							foreground: '#000000'
						},

						// secondary: {
						// 	50: '#FEFAEC',
						// 	100: '#FDF4D8',
						// 	200: '#FBE8AC',
						// 	300: '#F9DD86',
						// 	400: '#F7D25F',
						// 	500: '#F5C736',
						// 	600: '#E4B00B',
						// 	700: '#AA8308',
						// 	800: '#705606',
						// 	900: '#3A2D03',
						// 	DEFAULT: '#F5C736',
						// 	foreground: '#000000'
						// },
						// danger: {
						// 	50: '#FEE6EC',
						// 	100: '#FDCED9',
						// 	200: '#FB9DB4',
						// 	300: '#FA6B8E',
						// 	400: '#F83A69',
						// 	500: '#F50943',
						// 	600: '#C50736',
						// 	700: '#940528',
						// 	800: '#62041B',
						// 	900: '#31020D',
						// 	DEFAULT: '#F50943',
						// 	foreground: '#000000'
						// },
						warning: {
							50: '#FEFAEC',
							100: '#FDF4D8',
							200: '#FBE8AC',
							300: '#F9DD86',
							400: '#F7D25F',
							500: '#F5C736',
							600: '#E4B00B',
							700: '#AA8308',
							800: '#705606',
							900: '#3A2D03',
							DEFAULT: '#F5C736',
							foreground: '#000000'
						}
						// success: {
						// 	50: '#EDFDE7',
						// 	100: '#DBFCCF',
						// 	200: '#B7F8A0',
						// 	300: '#96F575',
						// 	400: '#72F146',
						// 	500: '#4EEE16',
						// 	600: '#3DC30E',
						// 	700: '#2E930B',
						// 	800: '#1E5F07',
						// 	900: '#0F3003',
						// 	DEFAULT: '#4EEE16',
						// 	foreground: '#000000'
						// }
					}
				}
			}
		})
	]
}
