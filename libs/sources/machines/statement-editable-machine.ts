import { setup } from 'xstate'

export const ASSESSMENT_STATUS_BEING_EVALUATED = 'being_evaluated'
export const ASSESSMENT_STATUS_APPROVAL_NEEDED = 'approval_needed'
export const ASSESSMENT_STATUS_PROOFREADING_NEEDED = 'proofreading_needed'
export const ASSESSMENT_STATUS_APPROVED = 'approved'

export const statementEditableMachine = setup({
  types: {
    context: {} as {
      state: string
      userId: string
      evaluatorId?: string
      isAuthorized(permissions: string[]): boolean
    },

    input: {} as {
      state: string
      userId: string
      evaluatorId?: string
      isAuthorized(permissions: string[]): boolean
    },
  },

  guards: {
    isStatementEditable: ({ context }): boolean => {
      const canEditAsEvaluator =
        context.userId === context.evaluatorId &&
        context.isAuthorized(['statements:edit-as-evaluator'])
      const isBeingEvaluated =
        context.state === ASSESSMENT_STATUS_BEING_EVALUATED
      const isApproved = context.state === ASSESSMENT_STATUS_APPROVED

      const canEditEverything = context.isAuthorized(['statements:edit'])
      const canEditAsProofreader = context.isAuthorized([
        'statements:edit-as-proofreader',
      ])

      return (
        ((canEditEverything || canEditAsProofreader) && !isApproved) ||
        (canEditAsEvaluator && isBeingEvaluated)
      )
    },
  },
}).createMachine({
  context: ({ input }) => ({
    state: input.state,
    userId: input.userId,
    evaluatorId: input.evaluatorId,
    isAuthorized: input.isAuthorized,
  }),
  id: 'Statement editable',
  initial: 'initial',
  states: {
    initial: {
      always: [
        { target: 'enabled', guard: 'isStatementEditable' },
        { target: 'disabled' },
      ],
    },
    enabled: {},
    disabled: {},
  },
})
