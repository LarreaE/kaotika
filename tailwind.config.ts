import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";
import customUtilities from "./src/plugins/customUtilities";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        'kaotika': ['kaotika', 'serif'],
      },
      colors: {
        medievalGold: '#DAA520',
        medievalRed: '#8B0000',
        medievalBlue: '#000080',
        medievalGray: '#2F4F4F',
        medievalSepia: '#cda882',
        darkSepia: '#87634A',
        blackSepia: '#513B2C'
      },
      borderColor: {
        sepia: '#cda882'
      },
      rotate: {
        'y-180': '180deg',
      },
    },
  },
  plugins: [nextui(),customUtilities],
};
export default config;
