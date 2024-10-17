import { sourceSchema } from '@/libs/sources/source-schema'

describe('Source schema', () => {
  const minReqValidFields = {
    name: 'Lorem ipsum',
  }

  const validData = {
    ...minReqValidFields,
    sourceUrl: 'https://example.com',
    transcript:
      'Morbi ut libero lorem. Nullam posuere facilisis nunc, ac pharetra enim laoreet vel.',
  }

  it('passes with min required fields filled', () => {
    expect(sourceSchema.safeParse(minReqValidFields).success).toBe(true)
  })

  it('passes with all fields filled', () => {
    expect(sourceSchema.safeParse(validData).success).toBe(true)
  })

  it('requires name', () => {
    const data = {}

    expect(sourceSchema.safeParse(data).success).toBe(false)
  })

  it('requires name is a non-empty string', () => {
    expect(sourceSchema.safeParse({ name: '  ' }).success).toBe(false)
    expect(sourceSchema.safeParse({ name: 'Hello, World' }).success).toBe(true)
  })

  it('validates source url', () => {
    expect(
      sourceSchema.safeParse({ ...minReqValidFields, sourceUrl: 'hello' })
        .success
    ).toBe(false)
    expect(
      sourceSchema.safeParse({ ...minReqValidFields, sourceUrl: '' }).success
    ).toBe(true)
    expect(sourceSchema.safeParse(validData).success).toBe(true)
  })

  it('validates transcript', () => {
    expect(
      sourceSchema.safeParse({
        ...minReqValidFields,
        transcript: 3,
      }).success
    ).toBe(false)

    expect(
      sourceSchema.safeParse({
        ...minReqValidFields,
        transcript: '',
      }).success
    ).toBe(true)

    expect(
      sourceSchema.safeParse({
        ...minReqValidFields,
        transcript: 'Non empty transcript',
      }).success
    ).toBe(true)
  })

  it('validates mediumId', () => {
    expect(
      sourceSchema.safeParse({ ...minReqValidFields, mediumId: 3 }).success
    ).toBe(false)

    expect(
      sourceSchema.safeParse({ ...minReqValidFields, mediumId: '123' }).success
    ).toBe(true)
  })
})
