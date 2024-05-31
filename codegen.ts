import type { CodegenConfig } from '@graphql-codegen/cli';
 const config: CodegenConfig = {
    schema: [{
      'https://payaxis.azurewebsites.net/graphql': {
      headers: {
        Authorization: `Bearer Y0NRs1DW5vOhzEjGx0UyFntyhAYxfPNZu4fcFBkzvOOJVjc3b0ct8jVE37bxkzhh3M5XFJMSpQeloYIl0AknypvGT6UXdslXE4vBW7aUOpDch2fUw26MCncZV4FJ21lDeUOQBtZUZRDu+MAXI8MuhbQED7vfTSze0npejrOC3eLMAqv3C9Smt+W8RARaDdcRb70BElwWCwGaDITcfN0dcbjIdF+0jZtP9eBGEyqm8TFxoSOpcBRknpZxulOpAPefC0X57vRlYIsiLc0XAXSTFm8HSF0yTc/umN3ozzkNs2AUOeZgMJc1AEBVpn5tRd0kV62vKZf/DCLlvMJxrX70FZERmcSFgRyLE6+dfSVaP0/XlKcTtn5Q6dCQ2YMnzg0D`,
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
