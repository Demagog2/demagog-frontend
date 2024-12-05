import { setup, assign, or } from 'xstate'
import {
  ASSESSMENT_STATUS_APPROVAL_NEEDED,
  ASSESSMENT_STATUS_APPROVED,
  ASSESSMENT_STATUS_BEING_EVALUATED,
  ASSESSMENT_STATUS_PROOFREADING_NEEDED,
} from '@/libs/constants/assessment'

type ContextType = {
  state: string
  evaluatorId?: string
  statementType: string
  authorization: {
    canEditStatement(): boolean
    canEditStatementAsProofreader(): boolean
    canEditStatementAsEvaluator(evaluatorId: string): boolean
  }
}

const statementRatingEditable = {
  initial: 'checkEnabled' as const,
  states: {
    checkEnabled: {
      always: [
        {
          target: 'editable' as const,
          guard: { type: 'isPromiseRatingEditable' as const },
        },
        { target: 'readOnly' as const },
      ],
    },
    editable: {},
    readOnly: {},
  },
}

const statementDetailsEditable = {
  initial: 'checkEnabled' as const,
  states: {
    checkEnabled: {
      always: [
        {
          target: 'editable' as const,
          guard: { type: 'isStatementEditable' as const },
        },
        { target: 'readOnly' as const },
      ],
    },
    editable: {},
    readOnly: {},
  },
}

const statementType = {
  initial: 'check_type' as const,
  states: {
    check_type: {
      always: [
        {
          target: 'factual' as const,
          guard: { type: 'isStatementFactual' as const },
        },
        {
          target: 'promise' as const,
          guard: { type: 'isStatementPromise' as const },
        },

        { target: 'newyears' as const },
      ],
    },
    factual: {},
    promise: {},
    newyears: {},
  },
}

export const machine = setup({
  types: {
    context: {} as ContextType,
    input: {} as ContextType,
    events: {} as
      | { type: 'Submit started' }
      | { type: 'Submit ended' }
      | { type: 'Request approval' }
      | { type: 'Back to evaluation' }
      | { type: 'Request proofreading' }
      | { type: 'Approve' },
  },
  guards: {
    isPromiseRatingEditable: or([
      '_canEditAsAdmin',
      '_canEditStatementAsProofreader',
    ]),

    isStatementEditable: or([
      '_canEditAsAdmin',
      '_canEditStatementAsProofreader',
      '_canEditStatementAsProofreader',
    ]),

    _canEditAsAnEvaluator: ({ context }) => {
      const isBeingEvaluated =
        context.state === ASSESSMENT_STATUS_BEING_EVALUATED

      const isUserAssignedAsEvaluator =
        context.authorization.canEditStatementAsEvaluator(
          context.evaluatorId ?? ''
        )

      return isBeingEvaluated && isUserAssignedAsEvaluator
    },

    _canEditAsAdmin: ({ context }) => context.authorization.canEditStatement(),

    _canEditStatementAsProofreader: ({ context }) =>
      context.authorization.canEditStatementAsProofreader(),

    isStatementFactual: ({ context }) => context.statementType === 'factual',
    isStatementPromise: ({ context }) => context.statementType === 'promise',
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
    statementType: input.statementType,
  }),
  id: 'Statement evaluation',
  type: 'parallel',
  states: {
    type: statementType,
    status: {
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
          type: 'parallel',
          states: {
            statementDetailsEditable,
            statementRatingEditable,
          },
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
          type: 'parallel',
          states: {
            statementDetailsEditable,
            statementRatingEditable,
          },
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
          type: 'parallel',
          states: {
            statementDetailsEditable,
            statementRatingEditable,
          },
          on: {
            'Request approval': {
              target: 'approval_needed',
              actions: assign({ state: ASSESSMENT_STATUS_APPROVAL_NEEDED }),
            },
          },
        },
      },
    },
  },
})
