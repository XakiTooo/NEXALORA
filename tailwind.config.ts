import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand & Primary
        primary: "#4241bc",
        "primary-container": "#5b5bd6",
        "primary-fixed": "#e2dfff",
        "primary-fixed-dim": "#c1c1ff",
        "on-primary": "#ffffff",
        "on-primary-container": "#edeaff",
        "on-primary-fixed": "#0a006b",
        "on-primary-fixed-variant": "#3533b0",
        "hero-gradient-end": "#6E6EED",

        // Secondary & Neutral
        secondary: "#5a5e69",
        "secondary-container": "#dee2ef",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#60646f",
        "secondary-fixed": "#dee2ef",
        "secondary-fixed-dim": "#c2c6d3",
        "on-secondary-fixed": "#171c25",
        "on-secondary-fixed-variant": "#424751",

        // Surface & Canvas (UX-4 standard)
        canvas: "#F8F9FC",
        surface: "#f9f9ff",
        "surface-default": "#FFFFFF",
        "surface-subtle": "#F3F4F8",
        "surface-dim": "#d3daea",
        "surface-bright": "#f9f9ff",
        "surface-container": "#e7eefe",
        "surface-container-low": "#f0f3ff",
        "surface-container-high": "#e2e8f8",
        "surface-container-lowest": "#ffffff",
        "surface-container-highest": "#dce2f3",
        "on-surface": "#151c27",
        "on-surface-variant": "#464553",
        "surface-tint": "#4e4ec9",

        // Text & Borders
        "text-primary": "#111827",
        "text-secondary": "#6B7280",
        "border-default": "#E5E7EB",
        "border-subtle": "#EEF0F6",
        outline: "#777585",
        "outline-variant": "#c7c4d6",

        // Status Feedback (Always paired with icon & text)
        "status-success-text": "#166534",
        "status-success-bg": "#DCFCE7",
        "status-warning-text": "#92400E",
        "status-warning-bg": "#FEF3C7",
        "status-error-text": "#B91C1C",
        "status-error-bg": "#FEE2E2",
        "status-info-text": "#3730A3",
        "status-info-bg": "#E0E7FF",

        // Pastel Discipline Badges
        "pill-informatika-text": "#C2410C",
        "pill-informatika-bg": "#FFEDD5",
        "pill-industri-text": "#15803D",
        "pill-industri-bg": "#DCFCE7",
        "pill-dkv-text": "#7E22CE",
        "pill-dkv-bg": "#F3E8FF",
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta-sans)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-plus-jakarta-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      fontSize: {
        display: ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-mobile": ["26px", { lineHeight: "34px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-h1": ["26px", { lineHeight: "34px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-h2": ["20px", { lineHeight: "28px", letterSpacing: "-0.005em", fontWeight: "600" }],
        "headline-h3": ["16px", { lineHeight: "24px", fontWeight: "600" }],
        "body-default": ["14px", { lineHeight: "22px", fontWeight: "400" }],
        "body-strong": ["14px", { lineHeight: "22px", fontWeight: "600" }],
        "label-default": ["13px", { lineHeight: "18px", fontWeight: "600" }],
        "caption-meta": ["12px", { lineHeight: "16px", fontWeight: "400" }],
        "caption-badge": ["11px", { lineHeight: "16px", letterSpacing: "0.04em", fontWeight: "700" }],
      },
      borderRadius: {
        card: "16px",
        input: "10px",
        btn: "12px",
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)",
        card: "0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)",
      },
    },
  },
  plugins: [],
};

export default config;
