module.exports = {
    extends: [
        "react-app",
        "eslint:recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        "plugin:react/recommended",
        "plugin:prettier/recommended",
        "plugin:unicorn/recommended",
        "prettier/@typescript-eslint",
        "prettier/react",
        "prettier/unicorn",
        "prettier"
        // "plugin:react-hooks/recommended"
    ],
    env: {
        browser: true,
        es6: true
    },
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module"
    },
    plugins: ["import", "unicorn", "react", "react-hooks"],
    settings: {
        "import/resolver": {
            alias: {
                map: [
                    ["@root", "./src"],
                    ["@comp", "./src/components"],
                    ["@config", "./src/config"],
                    ["@elem", "./src/elements"],
                    ["@store", "./src/store"],
                    ["@styles", "./src/styles"]
                ],
                extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
            }
        }
    },
    rules: {
        "@typescript-eslint/no-unused-vars": "error",
        "no-var": "error",
        "prefer-const": "error",
        curly: "error",
        "no-unused-vars": "off",
        "no-empty": "off",
        "react/prop-types": "off",
        "unicorn/no-reduce": "off",
        "react/jsx-uses-react": "error",
        "react-hooks/exhaustive-deps": "error"
    }
};
