import type { CodegenConfig } from '@graphql-codegen/cli';
import { environment } from '../../environments/environment';

const config: CodegenConfig = {
  schema: environment.GRAPHQL_URI,
  documents: './src/**/*.graphql',
  generates: {
    './src/graphql/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-apollo-angular',
      ],
    },
  },
};
export default config;
