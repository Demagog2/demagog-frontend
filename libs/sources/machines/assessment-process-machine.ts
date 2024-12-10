import { setup, assign, or, and } from 'xstate'
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
    canViewUnapprovedEvaluation(): boolean
  }
  // Data from the form
  longExplanation?: string
  shortExplanation?: string
  veracity?: string
  promiseRating?: string
}

const statementEvaluatorEditable = {
  initial: 'checkEnabled' as const,
  states: {
    checkEnabled: {
      always: [
        {
          target: 'editable' as const,
          guard: { type: 'isStatementEvaluatorEditable' as const },
        },
        { target: 'readOnly' as const },
      ],
    },
    editable: {},
    readOnly: {},
  },
}

const statementPublishable = {
  initial: 'checkEnabled' as const,
  states: {
    checkEnabled: {
      always: [
        {
          target: 'canBePublished' as const,
          guard: { type: 'isStatementPublishable' as const },
        },
        { target: 'cannotBePublished' as const },
      ],
    },
    canBePublished: {},
    cannotBePublished: {},
  },
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

const statementEvaluationVisibility = {
  initial: 'checkVisibility' as const,
  states: {
    checkVisibility: {
      always: [
        {
          target: 'visible' as const,
          guard: 'isStatementAssessmentVisible' as const,
        },
        { target: 'invisible' as const },
      ],
    },
    visible: {},
    invisible: {},
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
      | { type: 'Request approval' }
      | { type: 'Back to evaluation' }
      | { type: 'Request proofreading' }
      | { type: 'Approve' }
      | {
          type: 'Update veracity'
          data: { veracity: string }
        }
      | {
          type: 'Update promise rating'
          data: { promiseRating: string }
        }
      | {
          type: 'Update short explanation'
          data: { shortExplanation: string }
        }
      | {
          type: 'Update long explanation'
          data: { longExplanation: string }
        },
  },
  guards: {
    isPromiseRatingEditable: or([
      '_canEditAsAdmin',
      '_canEditStatementAsProofreader',
    ]),

    isStatementEditable: or([
      '_canEditAsAdmin',
      '_canEditAsAnEvaluator',
      '_canEditStatementAsProofreader',
    ]),

    isStatementAssessmentVisible: or([
      '_canEditAsAnEvaluator',
      '_canViewUnapprovedEvaluation',
      'isApproved',
    ]),

    isStatementPublishable: and(['_canEditAsAdmin', 'isApproved']),

    isStatementEvaluatorEditable: and(['_canEditAsAdmin', 'isBeingEvaluated']),

    _canEditAsAnEvaluator: ({ context }) => {
      const isBeingEvaluated =
        context.state === ASSESSMENT_STATUS_BEING_EVALUATED

      const isUserAssignedAsEvaluator =
        context.authorization.canEditStatementAsEvaluator(
          context.evaluatorId ?? ''
        )

      return isBeingEvaluated && isUserAssignedAsEvaluator
    },

    _hasVeracity: ({ context }) => !!context.veracity,
    _hasPromiseRating: ({ context }) => !!context.promiseRating,

    _hasShortExplanation: ({ context }) => !!context.shortExplanation?.length,
    _hasLongExplanation: ({ context }) => !!context.longExplanation?.length,

    canRequestApproval: and([
      '_hasShortExplanation',
      '_hasLongExplanation',
      or([
        and(['isStatementFactual', '_hasVeracity']),
        and(['isStatementPromise', '_hasPromiseRating']),
      ]),
      or(['_canEditAsAnEvaluator', '_canEditAsAdmin']),
    ]),

    _canEditAsAdmin: ({ context }) => context.authorization.canEditStatement(),

    _canEditStatementAsProofreader: ({ context }) =>
      context.authorization.canEditStatementAsProofreader(),

    _canViewUnapprovedEvaluation: ({ context }) =>
      context.authorization.canViewUnapprovedEvaluation(),

    isStatementFactual: ({ context }) => context.statementType === 'factual',
    isStatementPromise: ({ context }) => context.statementType === 'promise',
    isAprovalNeeded: ({ context }) =>
      context.state === ASSESSMENT_STATUS_APPROVAL_NEEDED,
    isProofreadingNeeded: ({ context }) =>
      context.state === ASSESSMENT_STATUS_PROOFREADING_NEEDED,
    isBeingEvaluated: ({ context }) =>
      context.state === ASSESSMENT_STATUS_BEING_EVALUATED,
    isApproved: ({ context }) => context.state === ASSESSMENT_STATUS_APPROVED,
    canApprove: ({ context }) => context.authorization.canEditStatement(),
  },
}).createMachine({
  context: ({ input }) => input,
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
            statementEvaluationVisibility,
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
            statementEvaluationVisibility,
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
          type: 'parallel',
          states: {
            statementEvaluationVisibility,
            statementPublishable,
          },
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
            statementEvaluationVisibility,
            statementEvaluatorEditable,
          },
          on: {
            'Update short explanation': {
              actions: assign({
                shortExplanation: ({ event }) => event.data.shortExplanation,
              }),
            },
            'Update long explanation': {
              actions: assign({
                longExplanation: ({ event }) => event.data.longExplanation,
              }),
            },
            'Update veracity': {
              actions: assign({
                veracity: ({ event }) => event.data.veracity,
              }),
            },
            'Update promise rating': {
              actions: assign({
                promiseRating: ({ event }) => event.data.promiseRating,
              }),
            },
            'Request approval': {
              target: 'approval_needed',
              actions: assign({ state: ASSESSMENT_STATUS_APPROVAL_NEEDED }),
              guard: {
                type: 'canRequestApproval',
              },
            },
          },
        },
      },
    },
  },
})
