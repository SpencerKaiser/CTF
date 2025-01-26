import eslint from 'eslint'
import mantine from 'eslint-config-mantine';
import tseslint from 'typescript-eslint';

export default [
  ...tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    ...mantine,
    { ignores: ['**/*.{mjs,cjs,js,d.ts,d.mts}'] },
    {
      rules: {
        "@typescript-eslint/consistent-type-definitions": ["error", "type"],
        "@typescript-eslint/restrict-template-expressions": [
          "error",
          { allowBoolean: true, allowNumber: true },
        ],
      },
    }
  )
];



