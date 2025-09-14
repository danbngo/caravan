import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default defineConfig([
    // Recommended configs first
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        ignores: ["dist", "node_modules"],
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        plugins: {
            react,
            "react-hooks": reactHooks,
            js,
            prettier
        },
        settings: {
            react: { version: "detect" }
        },
        extends: ["js/recommended"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: { jsx: true }
            },
            globals: {
                ...globals.browser, // 👈 adds `window`, `document`, `console`, etc.
                ...globals.node // 👈 if you also need Node (e.g. scripts/configs)
            }
        },
        rules: {
            "prettier/prettier": [
                "error",
                {
                    tabWidth: 4,
                    useTabs: false,
                    semi: true,
                    singleQuote: false,
                    trailingComma: "none"
                }
            ],
            "@typescript-eslint/no-unused-vars": "error",
            "no-unused-vars": "off",
            "react/react-in-jsx-scope": "off", // 🔥 explicitly disabled
            "react/jsx-uses-react": "off" // 🔥 disable the companion rule too
        }
    }
]);
