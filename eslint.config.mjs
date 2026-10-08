import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

// Next 16 removed `next lint`, so ESLint runs directly and needs flat config.
const config = [
  { ignores: [".next/**", "out/**", "node_modules/**", "public/**"] },
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      eqeqeq: ["error", "always"],
      "no-console": ["error", { allow: ["error"] }],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "react-hooks/exhaustive-deps": "off",
    },
  },
  {
    // Vendored shadcn components predate the React Compiler rules in
    // eslint-plugin-react-hooks v6 and are kept as upstream wrote them.
    files: ["src/app/_components/ui/**"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
    },
  },
];

export default config;
