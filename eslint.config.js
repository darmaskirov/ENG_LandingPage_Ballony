export default [
  {
    files: ["src/**/*.js", "tests/**/*.js", "scripts/**/*.js"],
    languageOptions: { ecmaVersion: "latest", sourceType: "module" },
    rules: {
      "no-unused-vars": "error",
      "no-constant-condition": "error",
      "no-duplicate-imports": "error",
      eqeqeq: "error",
    },
  },
];
