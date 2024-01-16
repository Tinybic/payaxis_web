import type { CodegenConfig } from '@graphql-codegen/cli';
 const config: CodegenConfig = {
    schema: [{
      'https://payaxis.azurewebsites.net/graphql': {
      headers: {
        Authorization: `Bearer Y0NRs1DW5vOhzEjGx0UyFs9xKoK9y31p4WaMIFnUIaxCzmSJSClsQ+t4PuC5Refuo8+e6x1hi+mUGPaRE1UExRpWeMF93PtquudVWXeVoXomV/FSqPVLTHmRYNLNKd9V9LgdYdyVXQSRcQK3Rl++KB/kMEqHeiuzYxzmP8ZhmVAHQNk/GQ90awIlDT6AMvPCY62lDhuyhjqmt75rZVsWXpjljrxoDCxzV3ENMNKy4Yw4JC2z/T3j/5WO/q67qcrTJd1LlbRR0AXVWmJLEjAGarbvnZ2jo0eSOfyr5rIfasl7G73g+ekSJw8xUk/vDLZycCiHa7lgqh9LDJ7ubFOd6w==`,
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
