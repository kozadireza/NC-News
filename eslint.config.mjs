import globals from "globals";
import pluginJs from "@eslint/js";
import jest from "eslint-plugin-jest";

/** @type {import('eslint').Linter.Config} */
export default {
  overrides: [
    {
      files: ["**/*.js"],
      languageOptions: {
        sourceType: "commonjs",
        globals: {
          ...globals.browser,
          ...globals.jest,
        },
      },
    },
    {
      files: ["**/*.test.js", "**/__tests__/**/*.js"],
      plugins: ["jest"],
      extends: ["plugin:jest/recommended"],
      rules: {
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/prefer-to-have-length": "warn",
        "jest/valid-expect": "error",
      },
    },
  ],
  ...pluginJs.configs.recommended,
};
