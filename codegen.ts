import type { CodegenConfig } from '@graphql-codegen/cli';
 const config: CodegenConfig = {
    schema: [{
      'http://192.168.99.18:4000/graphql': {
      headers: {
        Authorization: `Bearer Y0NRs1DW5vOhzEjGx0UyFs9xKoK9y31p4WaMIFnUIaxCzmSJSClsQ+t4PuC5Refuo8+e6x1hi+mUGPaRE1UExRpWeMF93PtquudVWXeVoXomV/FSqPVLTHmRYNLNKd9V9LgdYdyVXQSRcQK3Rl++KB/kMEqHeiuzYxzmP8ZhmVAHQNk/GQ90awIlDT6AMvPCY62lDhuyhjqmt75rZVsWXpjljrxoDCxzV3ENMNKy4YwowIVDTcOJ19LWK0MmUCtJw69Y/fLNriFttyOtpFCszYFRBPEbgk/2ks7qi5mKwKItP3JdW9tpMsXOC/Oz/dCZYrDNx5WE2hPX34NiLXU1tw==`,
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
