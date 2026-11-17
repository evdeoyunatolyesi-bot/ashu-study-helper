import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: {
    colors: { ink: "#070914", panel: "#101426", violet: "#8b5cf6", cyan: "#22d3ee" },
    boxShadow: { neon: "0 0 35px rgba(139,92,246,.18)" }
  }},
  plugins: []
};
export default config;
