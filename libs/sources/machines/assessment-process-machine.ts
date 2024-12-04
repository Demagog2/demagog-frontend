import { setup, assign } from 'xstate'
import {
  ASSESSMENT_STATUS_APPROVAL_NEEDED,
  ASSESSMENT_STATUS_APPROVED,
  ASSESSMENT_STATUS_BEING_EVALUATED,
  ASSESSMENT_STATUS_PROOFREADING_NEEDED,
} from '@/libs/constants/assessment'

type ContextType = {
  state: string
  evaluatorId?: string
  authorization: {
    canEditStatement(): boolean
    canEditStatementAsProofreader(): boolean
    canEditStatementAsEvaluator(evaluatorId: string): boolean
  }
}

const statementEditable = {
  initial: 'check_enabled' as const,
  states: {
    check_enabled: {
      always: [
        {
          target: 'enabled' as const,
          guard: { type: 'isStatementEditable' as const },
        },
        { target: 'disabled' as const },
      ],
    },
    enabled: {},
    disabled: {},
  },
}

export const machine = setup({
  types: {
    context: {} as ContextType,
    input: {} as ContextType,
    events: {} as
      | { type: 'Request approval' }
      | { type: 'Back to evaluation' }
      | { type: 'Request proofreading' }
      | { type: 'Approve' },
  },
  guards: {
    isStatementEditable: ({ context }): boolean => {
      const isBeingEvaluated =
        context.state === ASSESSMENT_STATUS_BEING_EVALUATED

      return (
        context.authorization.canEditStatement() ||
        context.authorization.canEditStatementAsProofreader() ||
        (context.authorization.canEditStatementAsEvaluator(
          context.evaluatorId ?? ''
        ) &&
          isBeingEvaluated)
      )
    },
    isAprovalNeeded: ({ context }) =>
      context.state === ASSESSMENT_STATUS_APPROVAL_NEEDED,
    isProofreadingNeeded: ({ context }) =>
      context.state === ASSESSMENT_STATUS_PROOFREADING_NEEDED,
    isApproved: ({ context }) => context.state === ASSESSMENT_STATUS_APPROVED,
    canApprove: ({ context }) => context.authorization.canEditStatement(),
  },
}).createMachine({
  context: ({ input }) => ({
    state: input.state,
    evaluatorId: input.evaluatorId,
    authorization: input.authorization,
  }),
  id: 'Statement evaluation',
  initial: 'Initial',
  states: {
    Initial: {
      always: [
        {
          target: 'approval_needed',
          guard: 'isAprovalNeeded',
        },
        {
          target: 'proofreading_needed',
          guard: 'isProofreadingNeeded',
        },
        {
          target: 'approved',
          guard: 'isApproved',
        },
        {
          target: 'being_evaluated',
        },
      ],
    },
    approval_needed: {
      ...statementEditable,
      on: {
        'Back to evaluation': {
          target: 'being_evaluated',
          actions: assign({ state: ASSESSMENT_STATUS_BEING_EVALUATED }),
        },
        'Request proofreading': {
          target: 'proofreading_needed',
          actions: assign({ state: ASSESSMENT_STATUS_PROOFREADING_NEEDED }),
          guard: {
            type: 'canApprove',
          },
        },
      },
    },
    proofreading_needed: {
      ...statementEditable,
      on: {
        Approve: {
          target: 'approved',
          actions: assign({ state: ASSESSMENT_STATUS_APPROVED }),
        },
        'Back to evaluation': {
          target: 'being_evaluated',
          actions: assign({ state: ASSESSMENT_STATUS_BEING_EVALUATED }),
        },
      },
    },
    approved: {
      on: {
        'Back to evaluation': {
          target: 'being_evaluated',
          actions: assign({ state: ASSESSMENT_STATUS_BEING_EVALUATED }),
        },
      },
    },
    being_evaluated: {
      ...statementEditable,
      on: {
        'Request approval': {
          target: 'approval_needed',
          actions: assign({ state: ASSESSMENT_STATUS_APPROVAL_NEEDED }),
        },
      },
    },
  },
})
