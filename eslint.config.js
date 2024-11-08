// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
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
      "@typescript-eslint/member-ordering": [
        "error",
        {
          default: [
            // Static Properties
            "public-static-field",
            "protected-static-field",
            "private-static-field",
            // Properties
            "public-instance-field",
            "protected-instance-field",
            "private-instance-field",
            // Constructors
            "public-constructor",
            "protected-constructor",
            "private-constructor",
            // Static method
            "public-static-method",
            "protected-static-method",
            "private-static-method",
            // Method
            "public-instance-method",
            "protected-instance-method",
            "private-instance-method"
          ],
        },
      ],
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "@typescript-eslint/naming-convention": ["error",
        {
          selector: "default",
          format: ["camelCase"],
          leadingUnderscore: "allow",
          trailingUnderscore: "forbid",
        },
        {
          selector: "import",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow",
          trailingUnderscore: "forbid",
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "class",
          format: ["PascalCase"]
        },
        {
          selector: "method",
          modifiers: ["public"],
          format: ["PascalCase"],
          leadingUnderscore: "forbid",
          filter: { regex: "^ng.*", match: false }
        },
        {
          selector: "method",
          modifiers: ["private"],
          format: ["camelCase"],
          leadingUnderscore: "forbid"
        },
        {
          selector: "property",
          modifiers: ["public"],
          format: ["PascalCase"],
          leadingUnderscore: "forbid"
        },
        {
          selector: "property",
          format: ["PascalCase"],
          leadingUnderscore: "forbid"
        },
        {
          selector: "property",
          modifiers: ["private"],
          format: ["camelCase"],
          leadingUnderscore: "forbid"
        },
        {
          selector: "classicAccessor",
          modifiers: ["public"],
          format: ["PascalCase"],
          leadingUnderscore: "forbid"
        },
        {
          selector: "classicAccessor",
          format: ["PascalCase"],
          leadingUnderscore: "forbid"
        },
        {
          selector: "classicAccessor",
          modifiers: ["private"],
          format: ["camelCase"],
          leadingUnderscore: "forbid"
        },
        {
          selector: "objectLiteralProperty",
          format: ["camelCase", "PascalCase"],
          leadingUnderscore: "forbid"
        },
        {
          selector: "variable",
          format: ["camelCase"]
        },
        {
          selector: "enum",
          format: ["PascalCase"]
        },
        {
          selector: "enumMember",
          format: ["PascalCase"]
        },
        {
          selector: "parameterProperty",
          format: ["PascalCase", "camelCase"]
        },
        {
          selector: "parameter",
          format: ["PascalCase", "camelCase"]
        },
      ]
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
    },
  }
);
