import type { CodegenConfig } from '@graphql-codegen/cli';
 const config: CodegenConfig = {
    schema: [{
      'https://payaxis.azurewebsites.net/graphql': {
      headers: {
        Authorization: `Bearer Y0NRs1DW5vOhzEjGx0UyFt6WDvujCzqacI0y3HPlijhIyJPjMmRfLECePTF2e9qoqjTEwjCBbUI3qrRMB1Ucop7F+5C1Aix8jbWzADqFifvdY/uESC5CBeiva8uJar0oqKkRGrj/nb3blRT1KqiJmo+dL85GBIIgfvLWUlFXP7O8/8oEJmhNRakhOuk6elKhUOxfWI0t1S8rgRe0TLVIlvyXYjyzY3pvbDLXO7WdN7cksrwCcolb+gqY8UN63eLWEskBm5wsPDtrJIFCjUJew37pAz3VrybT1A8lEV5G9XPSpplTaYK7yhK3XFwUVN+0IO8LX1eQiPExZxW/o0Wieg==`,
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
