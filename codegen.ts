import type { CodegenConfig } from '@graphql-codegen/cli';
 const config: CodegenConfig = {
    schema: [{
      'http://192.168.99.18:4000/graphql': {
      headers: {
        Authorization: `Bearer Y0NRs1DW5vOhzEjGx0UyFi54jXpbyuAJOmyauGJT1qXLZDyeJdiJusG0hQO4QthSFekaLWB921hRVYjn1YucNk/ruP/H+jN2qCBdNB4QjzegHh50K1S0/BCgKLEBLqYb/56b3dUB9/cK6Kw2b7eU5ikghxlmEKjjv8IARt5EYws+4GOvcNbxQersQu76l6TopTYrCfnxmTCEmB7Rx3Mbh3oNpHoopGrAI3575y1lfVQxD6JzBevXg72VliiKNRGbmjMTgndAY/mpJVwP0uM0qZSdWRcwBsIPkMrOdvbfEgEH7Z8AHfHE2J+Ett2quCYU3bmzNFGaL24lhFU4CLfbng==`,
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