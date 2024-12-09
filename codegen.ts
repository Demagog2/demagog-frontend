import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'https://api.demagog.cz/graphql',
  documents: [
    'pages/**/*.tsx',
    'app/**/*.tsx',
    'app/**/*.ts',
    'components/**/*.ts',
    'components/**/*.tsx',
    'libs/**/*.ts',
    'libs/**/*.tsx',
  ],
  generates: {
    './__generated__/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
}

export default config
