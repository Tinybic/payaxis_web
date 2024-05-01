import type { CodegenConfig } from '@graphql-codegen/cli';
 const config: CodegenConfig = {
    schema: [{
      'https://payaxis.azurewebsites.net/graphql': {
      headers: {
        Authorization: `Bearer Y0NRs1DW5vOhzEjGx0UyFig7h8QDkQj3+eY3sA0hjjpjhtdOhdtsC8OOT4MnT9PUzSg8BtBN0m9HZrZ6IwMBa+Ooki14sVejd+uwu8fI01hj5uVBMZt3PQQPOUXT+gNneJvskm+1dd7tuFsWQYYuzxksFqUlE6yFZC+QqOvmUK4nzHOARaEpPvJ9JMYRRHlsOCsrTiEmnQ4xawaOTL3XoJRzBz+K0uf7yQ9GxnYttXpzIVUWFbPWRQfT29/Y6XHzQzTL0YG2A4aKPncJZUUV61ax2wBGeAT8q1jQu4f7E4Oz9iCFPWkG/joh4iu2Scq84J+yCKWE37p79/J/C0YgnQ==`,
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
