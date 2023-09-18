import type { CodegenConfig } from '@graphql-codegen/cli';
 const config: CodegenConfig = {
    schema: [{
      'http://192.168.99.18:4000/graphql': {
      headers: {
        Authorization: `Bearer Y0NRs1DW5vOhzEjGx0UyFsFYYfLinKWIbbyrmu0336TA4I5JvwKX6Lo5Lpb3LEF4Cjwk5bdowce6mTGLTWt2/pMyoBwBTXZlJ9W7PaRYmURT19fW3lZpmR2HSRWJ9NpWRZ1kNeA9zQEtJroix07mHaIMIauO6hdOUEe2HKFQ+GEF/zKU6hKBv1Tl1BOGn1o+Ys1LleG1gIrxsqd9JzCaskjMi0iCU8YFXO7XeZQiCqOz7MMAkCd0KuRSIbWqWbu0pKKJnTZesgaDaEPcBVl2Th5ldO2+jLq4CWzIx3S4oHGgOYr8skISNpEGw0aAlapOzvswt/3t87Eaj/CWPDvCfA==`,
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
