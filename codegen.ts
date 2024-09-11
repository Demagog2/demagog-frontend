import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'https://demagog.cz/graphql',
  documents: ['pages/**/*.tsx', 'app/**/*.tsx', 'components/**/*.tsx'],
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
