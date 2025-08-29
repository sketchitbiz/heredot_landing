import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // 사용하지 않는 변수들을 경고로 변경 (에러 -> 경고)
      "@typescript-eslint/no-unused-vars": "warn",
      "no-unused-vars": "warn",
      
      // 기타 일반적으로 에러로 처리되는 것들을 경고로 변경
      "prefer-const": "warn",
      "no-var": "warn",
    }
  }
];

export default eslintConfig;
