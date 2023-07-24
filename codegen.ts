import type { CodegenConfig } from '@graphql-codegen/cli';
 const config: CodegenConfig = {
    schema: [{
      'http://192.168.99.18:4000/graphql': {
      headers: {
        Authorization: `Bearer Y0NRs1DW5vOhzEjGx0UyFv/w/7Y+ZGKjm4zPvRhN36UuqTTzdQrk875DtReOczmNg1K9d5KDMCJUie/Q1Xv3RSVb3Ur6QCuApO9GkilppS8SQvek9fq/rdHHmJ61EHm7cFPAGX/4o5TYDWOrrh7C+teZG0OH8cJB6JjUUXg5X9Ep90u+XiqB0DAXesr8EAZhMZErZCXGJ0pEFvqT1BJqxom4t5AWzb1bmWb2wfHHQQ8voG7ODTquz4hydYBYY6m5Eq7KdySUnoyjr2UcYqPHrbShdJXVzJYZFxlbCAvQnD39vOfXZEEI2vnj/ktK1qchVsM/PgySsXnJKsYVFkpCS4p4oWz85S/hOqmM9u2xVvs=`,
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