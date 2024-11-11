import { set } from 'lodash'
import { SafeParseReturnType, ZodType } from 'zod'

/**
 * Parses form data according to the given schema.
 *
 * @param schema - zod schema, typically object containing properties
 * @param formData - form data sent to the server
 */
export function safeParse<T extends ZodType>(
  schema: T,
  formData: FormData
): SafeParseReturnType<T['_input'], T['_output']> {
  return schema.safeParse(buildObject(formData))
}

/**
 * Takes form data and builds object out of it.
 *
 * Compared to the common method of using `Object.fromEntries(formData)` it's able to build arrays of objects of any depth
 *
 * For example form data with containing `{ "foo[0].key": "42", "foo[1].key": "44" }` will be converted to an object such as `{ foo: [{ key: "42"}, { key: "44" }] }`
 *
 * @param formData
 */
function buildObject(formData: FormData) {
  const obj: Record<string, any> = {}
  for (const [key, value] of formData.entries()) {
    set(obj, key, value)
  }
  return obj
}
