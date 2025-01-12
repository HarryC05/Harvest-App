import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import babelParser from "@babel/eslint-parser";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginImport from "eslint-plugin-import";
import jsdocPlugin from "eslint-plugin-jsdoc";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: "latest",
      sourceType: "module",
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false, // Allows parsing without .babelrc
        babelOptions: {
          presets: ["@babel/preset-react"], // Parse JSX
        },
      },
    },
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      import: pluginImport,
			jsdoc: jsdocPlugin,
			prettier: prettierPlugin,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginReact.configs.flat.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
			...jsdocPlugin.configs.recommended.rules,
			...prettierConfig.rules,
      "import/no-unresolved": "error",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
			"jsdoc/require-jsdoc": [
        "error",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: true,
            FunctionExpression: true,
          },
        },
      ],
      "jsdoc/require-param": "error",
      "jsdoc/require-returns": "error",
			"jsdoc/tag-lines": [
        "error",
        "any",
        {
          startLines: 1,
        },
      ],
			"jsdoc/no-undefined-types": "off",
			"jsdoc/check-line-alignment": ["error"|"warn", "always", {"tags":["param"]}],
			"prettier/prettier": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
		ignores: [
			"src/setupProxy.js",
		]
  },
];
