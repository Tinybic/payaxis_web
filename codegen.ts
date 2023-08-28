import type { CodegenConfig } from '@graphql-codegen/cli';
 const config: CodegenConfig = {
    schema: [{
      'https://payaxis.azurewebsites.net/graphql': {
      headers: {
        Authorization: `Bearer Y0NRs1DW5vOhzEjGx0UyFi54jXpbyuAJOmyauGJT1qXLZDyeJdiJusG0hQO4QthSiBGkgSN5bIz74cZYoWkiRj4Qdf5vphsE0EmqUpZ87wuGFWUSnK6vRlvXSll8an+ZYVOxyE71kC5q+EquuRLr2KvRfJmrEvBsQVblYpSrCT2lEaRf38rH0zQauzRvSGgzHvMRXAAIE7RoMztYfYnrBw/lcPUoxrdAekIAER9lPgMSXlh+ooqNyv3zPd5G6rF1lRXKs87Y8erRSDX40LWqZyLaW64A9gBCWhFnMTDPV9iwWVzUPSag9EzEtwqUS81xk/vhpqlVPF3hZE6+VmQ6HA==`,
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
