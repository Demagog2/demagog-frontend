import type { FormState } from '@/libs/forms/form-state'

export type FormAction = (
  prevState: FormState,
  input?: FormData
) => Promise<FormState>
