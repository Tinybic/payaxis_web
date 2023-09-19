import type { CodegenConfig } from '@graphql-codegen/cli';
 const config: CodegenConfig = {
    schema: [{
      'http://192.168.99.18:4000/graphql': {
      headers: {
        Authorization: `Bearer Y0NRs1DW5vOhzEjGx0UyFs9xKoK9y31p4WaMIFnUIaxCzmSJSClsQ+t4PuC5Refuo8+e6x1hi+mUGPaRE1UExRpWeMF93PtquudVWXeVoXomV/FSqPVLTHmRYNLNKd9V9LgdYdyVXQSRcQK3Rl++KMvMNaN7kqnSWC4FwLSm5o2RzY31d3PxKZSx4OSzM3qmvnKbJeY6/cSZEBG+xnBZ+tCCHZgSlFOKcxDY4TOezBOCbw3jdCMdJwnAb3d+TDB+wJAfdZ8uPzfBoRjel7EaVjL8SFf933uD/YKH+qIjUbbNEjdB7C0jbs/OHviiCzOD`,
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
