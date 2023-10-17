/** @type {import("tailwindcss").Config} */
export default {
    mode: "jit",
    content: ["./src/**/*.{html,js,svelte,ts}"],
    plugins: [require("@tailwindcss/typography"), require("daisyui")],
    daisyui: {
        themes: ["light", "dark"]
    }
};
