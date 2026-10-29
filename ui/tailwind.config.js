/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: { sans: ["'Noto Sans Thai'", "Inter", "ui-sans-serif", "system-ui", "sans-serif"] },
      // Semantic steps in rem so text tracks the browser/OS font size (WCAG 1.4.4).
      // Use these instead of arbitrary text-[Npx] values.
      fontSize: {
        micro: ["0.6875rem", { lineHeight: "1.4" }], // 11px — dense metadata, chips
        meta: ["0.75rem", { lineHeight: "1.45" }], //  12px — secondary labels
        caption: ["0.8125rem", { lineHeight: "1.45" }], // 13px — nav, compact rows
        "title-sm": ["0.9375rem", { lineHeight: "1.4" }], // 15px — card titles
        page: ["1.375rem", { lineHeight: "1.25" }], // 22px — page titles
      },
      colors: {
        bg: v("bg"),
        deep: v("deep"),
        card: v("card"),
        card2: v("card2"),
        line: v("line"),
        fg: v("fg"),
        muted: v("muted"),
        subtle: v("subtle"),
        accent: v("accent"),
        danger: v("danger"),
        success: v("success"),
        info: v("info"),
        warn: v("warn"),
        // Foreground on a solid accent fill.
        "accent-fg": v("accent-fg"),
        // Text-safe variants of the status hues. The base tokens above are tuned
        // for fills/borders (3:1); these clear 4.5:1 as text in both themes.
        "accent-text": v("accent-text"),
        "danger-text": v("danger-text"),
        "success-text": v("success-text"),
        "warn-text": v("warn-text"),
        "info-text": v("info-text"),
      },
      borderRadius: { xl: "0.875rem" },
      keyframes: {
        pulseRing: { "0%": { boxShadow: "0 0 0 0 rgb(var(--accent) / .55)" }, "100%": { boxShadow: "0 0 0 10px rgb(var(--accent) / 0)" } },
        shimmer: { "0%": { backgroundPosition: "-400px 0" }, "100%": { backgroundPosition: "400px 0" } },
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        popIn: { from: { opacity: "0", transform: "translateY(6px) scale(0.985)" }, to: { opacity: "1", transform: "none" } },
        slideInRight: { from: { transform: "translateX(16px)", opacity: "0.6" }, to: { transform: "none", opacity: "1" } },
      },
      animation: {
        pulseRing: "pulseRing 1.6s ease-out infinite",
        shimmer: "shimmer 1.4s linear infinite",
        fadeIn: "fadeIn 150ms ease-out",
        popIn: "popIn 160ms cubic-bezier(0.22, 1, 0.36, 1)",
        slideInRight: "slideInRight 180ms cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
