import { FormState } from '@/libs/forms/form-state'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

export function useFormToasts(state: FormState) {
  useEffect(() => {
    switch (state.state) {
      case 'error':
        toast.error(state.message)
        return
      case 'success':
        toast.success(state.message)
        return
    }
  }, [state])
}
