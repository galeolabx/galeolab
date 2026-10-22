import js from "@eslint/js";
import react from "eslint-plugin-react";
import globals from "globals";
export default [
  { ignores: ["dist/**", "node_modules/**"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { react },
    rules: {
      ...react.configs.recommended.rules,
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": [
        "error",
        { varsIgnorePattern: "^React$|^_", argsIgnorePattern: "^_" },
      ],
    },
    settings: { react: { version: "18.2" } },
  },
];
