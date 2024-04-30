import type { CodegenConfig } from '@graphql-codegen/cli';
 const config: CodegenConfig = {
    schema: [{
      'https://payaxis.azurewebsites.net/graphql': {
      headers: {
        Authorization: `Bearer Y0NRs1DW5vOhzEjGx0UyFkCek8XiX8sp8ONBHJiVo2zWCeg67nFQP8dWYCVZAMc0fcfLb5cXxaw0o5Rjtol4SUCu3k3gV1pID16BM/U93Eub2QnkjMLBj+rC1UV1/SIaPW1UpL0IQ+S6M5kcxq+ZhLbVIr1AZg9wRhbKNbvMLMBXfP+vYsWpDeroP9jfzfnZtGpY8Z2jEbo2WPCaCHX7c/tv46/XIZ6aknZdZv746Bz9jGXqVROl/CeqH3KR7YiM+uXLIlgFlnsQT8NSXg4LMDjHSmHZa0V3WrJJfGoAimkpGwsc1SjFX3g9zv6qAo5ZAGtgNVqvvGyJuRRL2ZxiG8V17tTb2AxyO+wmB463KAnANI7IvbaW1QV/JvoK35ol`,
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
