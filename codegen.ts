import type { CodegenConfig } from '@graphql-codegen/cli';
 const config: CodegenConfig = {
    schema: [{
      'https://payaxis.azurewebsites.net/graphql': {
      headers: {
        Authorization: `Bearer Y0NRs1DW5vOhzEjGx0UyFsFYYfLinKWIbbyrmu0336TA4I5JvwKX6Lo5Lpb3LEF4Cjwk5bdowce6mTGLTWt2/pMyoBwBTXZlJ9W7PaRYmURT19fW3lZpmR2HSRWJ9NpWRZ1kNeA9zQEtJroix07mHaIMIauO6hdOUEe2HKFQ+GEF/zKU6hKBv1Tl1BOGn1o+Ys1LleG1gIrxsqd9JzCaskjMi0iCU8YFXO7XeZQiCqOJ2OL+00Bv1z3dhzjsICbrNf3FTYJ4mbaDp61cXpYejZPiUvhPoFAaKSsmHQcGuZoQqhzG+GkFfFnEFWLs3vQGcd9ObF+kHtRdJmCn3WCaLQ==`,
      },
    }
  }],
   generates: {
     './src/app/core/generated/generated.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-apollo-angular']
    }
   },
 };
 export default config;
