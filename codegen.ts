import type { CodegenConfig } from '@graphql-codegen/cli';
 const config: CodegenConfig = {
    schema: [{
      'http://192.168.99.18:4000/graphql': {
      headers: {
        Authorization: `Bearer Y0NRs1DW5vOhzEjGx0UyFmlPotC3AfmZK1/7sSMhPM2b6mUr76l27YCo7zBE0xnRWeEva2boxdFKtRRXdhvzvAvlYhvK+JTZ42000yxP5e1VeHjYkDJSExhbelc8M0qEhEtnw+sthtxDbxcXAXVvbTLoNBNAgPDV55QM+/sC5pokbdBTVe3dwEbACNygYpaim0C+1YBAt0k0vcwtqjc/fX8Zlt38+Ji9yFpITXsuhpE2e8+aq0Cns5SzXQvrT439g9ZZHUd/YI/RrlqsXIZh7KAwTiD3Tskfodh2f0/uDUqqyIJTc7+EeW+qESn9zsQY`,
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
