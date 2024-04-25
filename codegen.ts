import type { CodegenConfig } from '@graphql-codegen/cli';
 const config: CodegenConfig = {
    schema: [{
      'https://payaxis.azurewebsites.net/graphql': {
      headers: {
        Authorization: `Bearer Y0NRs1DW5vOhzEjGx0UyFig7h8QDkQj3+eY3sA0hjjpjhtdOhdtsC8OOT4MnT9PUzSg8BtBN0m9HZrZ6IwMBa+Ooki14sVejd+uwu8fI01hj5uVBMZt3PQQPOUXT+gNneJvskm+1dd7tuFsWQYYuzxksFqUlE6yFZC+QqOvmUK4nzHOARaEpPvJ9JMYRRHlsOCsrTiEmnQ4xawaOTL3XoJRzBz+K0uf7yQ9GxnYttXpzIVUWFbPWRQfT29/Y6XHzOflP16aGKLCC6Olsiyi8MXm31mslVo5B22tdR/J3LsoVYWAC6hIR0Rd/8/hCm6YMAU3aKMdCm6wUUeWmEa/j4A==`,
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
