const config = {
  plugins: {
    "@tailwindcss/postcss": {
      config: "./tailwind.config.ts",
      input: "./app/tailwind-input.css"
    }
  },
};

export default config;
