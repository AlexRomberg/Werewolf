// @ts-nocheck
import { configs } from "@eslint/js";
import { config, configs as tsConfigs } from "typescript-eslint";
import { configs as ngConfigs, processInlineTemplates } from "angular-eslint";

export default config(
  {
    files: ["**/*.ts"],
    extends: [
      configs.recommended,
      ...tsConfigs.recommended,
      ...tsConfigs.stylistic,
      ...ngConfigs.tsRecommended,
    ],
    processor: processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      "quotes": ["error", "double"],
      "indent": ["error", 4, { "SwitchCase": 1 }],
      "semi": ["error", "always"],
      "sort-imports": [
        "error",
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
        },
      ],
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...ngConfigs.templateRecommended,
      ...ngConfigs.templateAccessibility,
    ],
    rules: {
    },
  }
);
