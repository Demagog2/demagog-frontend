interface FormStateInitial {
  state: 'initial'
}

interface FormStateSuccess {
  state: 'success'
  message: string
  fields: Record<string, any>
}

interface FormStateError {
  state: 'error'
  message: string
  fields: Record<string, any>
}

export type FormState = FormStateInitial | FormStateSuccess | FormStateError
