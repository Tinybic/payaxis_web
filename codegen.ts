import type { CodegenConfig } from '@graphql-codegen/cli';
 
 const config: CodegenConfig = {
    schema: [{
      'https://payaxis.azurewebsites.net/graphql': {
      headers: {
        Authorization: `Bearer Y0NRs1DW5vOhzEjGx0UyFs9xKoK9y31p4WaMIFnUIaz0bU6jBro4ApbP/oR0gAdnDDUyye+Fhf6E/Ed0ln1162MP6C3Q1JcMs1ZwWa1td6oJIpe57QhDS1HCRzAdSakRpawXgdvUJSVVJZiXhVq+WHHACFA1Cb5mi5gVM0rmKPXrtOx8HWrlVUva4kHBFdYMPiX9Z0S1QO8HOY+WnNgsnXo1eFqiuHr9Yv8RadqaK1xEchK1h5JCWMnut7EfmhVHLXY8wZ0jvg5DzeYchaV+8yHEBlNJAcbHaOmwrvKpzqckBr5pXhMgt6x4vRuBthX2ODwVj4SMyiLZBY5G7LAb9A==`,
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