import { autoSaveMachine } from '@/libs/sources/machines/auto-save-machine'
import { useActorRef } from '@xstate/react'

export function useAutoSaveFormMachine(submitForm: () => void) {
  const actorRef = useActorRef(autoSaveMachine, {
    input: {
      saveForm: submitForm,
    },
  })

  return actorRef
}
