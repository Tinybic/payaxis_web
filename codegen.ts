import type { CodegenConfig } from '@graphql-codegen/cli';
 
 const config: CodegenConfig = {
    schema: [{
      'https://payaxis.azurewebsites.net/graphql': {
      headers: {
        Authorization: `Bearer Y0NRs1DW5vOhzEjGx0UyFmv6HEg3H+pyqRGXlz5JCoYwiLeeyCVmkZ80H2EI8bafXnqBQuf8Dvl9RO8PsbB2CCJN7mjikkTXubEjOL+TaYpu7xnHzxLSvtri0WjhjA5eiK27NzZzg5YJ95aK7zZuY4RA+jMzAzoIzLaR014BkWSFKz5Ws7hH52h3f5l10Cv6xSpOOCP6Hso2RFTltJ2dfbAwhUODWhYLVf8UJ0+dqpsZP/vUYq24dRtkfVR2q8z4p9JFMazjT5FFYi3CmEjftvDyuDcrB7gNGKbQ1d60EoTzWPR0ahOpWRWBlQ/3DbTO`,
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