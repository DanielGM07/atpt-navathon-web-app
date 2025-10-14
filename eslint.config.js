import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  {
    name: "custom-config",
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    files: ["**/*.js", "**/*.jsx"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      prettier,
      import: importPlugin,
      "unused-imports": unusedImports,
    },
    ignores: ["dist", "node_modules"],
    rules: {
      "no-unused-vars": "off",
      "react/jsx-uses-react": "off", // React 17+ ya no necesita importar React explícitamente
      "react/jsx-uses-vars": "error",
      "react/jsx-no-undef": "error",
      "arrow-body-style": "off",
      "prefer-arrow-callback": "off",
      "react/prop-types": "off",
      "no-undef": "error",
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
      "unused-imports/no-unused-imports": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
