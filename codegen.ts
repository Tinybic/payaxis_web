import type { CodegenConfig } from '@graphql-codegen/cli';
 const config: CodegenConfig = {
    schema: [{
      'https://payaxis.azurewebsites.net/graphql': {
      headers: {
        Authorization: `Bearer Y0NRs1DW5vOhzEjGx0UyFs9xKoK9y31p4WaMIFnUIaxCzmSJSClsQ+t4PuC5Refuo8+e6x1hi+mUGPaRE1UExRpWeMF93PtquudVWXeVoXomV/FSqPVLTHmRYNLNKd9V9LgdYdyVXQSRcQK3Rl++KB/kMEqHeiuzYxzmP8ZhmVAHQNk/GQ90awIlDT6AMvPCY62lDhuyhjqmt75rZVsWXpjljrxoDCxzV3ENMNKy4YyJuXh1ZFb6iL2yatx6Ob6V3gIf95QfxVnuuUUKSuwpkVykab9fcZSEx6r2fzbWhO+E6DG9+Rt2b7zwJxLY5fOsoKTMUe09Ka2/X3clnOB/TA==`,
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
