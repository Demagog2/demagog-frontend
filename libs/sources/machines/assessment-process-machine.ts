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
  isPublished: boolean
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
      | { type: 'Publish' }
      | { type: 'Unpublish' }
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
    isPromiseRatingEditable: or(['_canEditAsAdmin', '_canEditAsProofreader']),

    isStatementEditable: or([
      '_canEditAsAdmin',
      '_canEditAsAnEvaluator',
      '_canEditAsProofreader',
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

    canRequestProofreading: and(['_canEditAsAdmin', 'isApprovalNeeded']),

    canApprove: and([
      'isProofreadingNeeded',
      or(['_canEditAsProofreader', '_canEditAsAdmin']),
    ]),

    canReturnBackToEvaluation: or([
      and([
        'isApprovalNeeded',
        or(['_canEditAsAdmin', '_canEditAsAnEvaluator']),
      ]),
      and([
        'isProofreadingNeeded',
        or([
          '_canEditAsProofreader',
          '_canEditAsAdmin',
          '_canEditAsAnEvaluator',
        ]),
      ]),
      and(['isApproved', or(['_canEditAsAdmin'])]),
    ]),

    _canEditAsAdmin: ({ context }) => context.authorization.canEditStatement(),

    _canEditAsProofreader: ({ context }) =>
      context.authorization.canEditStatementAsProofreader(),

    _canViewUnapprovedEvaluation: ({ context }) =>
      context.authorization.canViewUnapprovedEvaluation(),

    _isStatementPublished: ({ context }) => context.isPublished,

    isStatementFactual: ({ context }) => context.statementType === 'factual',
    isStatementPromise: ({ context }) => context.statementType === 'promise',
    isApprovalNeeded: ({ context }) =>
      context.state === ASSESSMENT_STATUS_APPROVAL_NEEDED,
    isProofreadingNeeded: ({ context }) =>
      context.state === ASSESSMENT_STATUS_PROOFREADING_NEEDED,
    isBeingEvaluated: ({ context }) =>
      context.state === ASSESSMENT_STATUS_BEING_EVALUATED,
    isApproved: ({ context }) => context.state === ASSESSMENT_STATUS_APPROVED,
    isPublished: and(['isApproved', '_isStatementPublished']),
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
              guard: 'isApprovalNeeded',
            },
            {
              target: 'proofreading_needed',
              guard: 'isProofreadingNeeded',
            },
            {
              target: 'published',
              guard: 'isPublished',
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
              guard: {
                type: 'canReturnBackToEvaluation',
              },
            },
            'Request proofreading': {
              target: 'proofreading_needed',
              actions: assign({ state: ASSESSMENT_STATUS_PROOFREADING_NEEDED }),
              guard: {
                type: 'canRequestProofreading',
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
            guard: {
              type: 'canApprove',
            },
            'Back to evaluation': {
              target: 'being_evaluated',
              actions: assign({ state: ASSESSMENT_STATUS_BEING_EVALUATED }),
              guard: {
                type: 'canReturnBackToEvaluation',
              },
            },
          },
        },
        published: {
          type: 'parallel',
          states: {
            statementEvaluationVisibility,
          },
          on: {
            Unpublish: {
              target: 'approved',
              actions: assign({ isPublished: false }),
              guard: {
                type: 'isStatementPublishable',
              },
            },
          },
        },
        approved: {
          type: 'parallel',
          states: {
            statementEvaluationVisibility,
          },
          on: {
            Publish: {
              target: 'published',
              actions: assign({ isPublished: true }),
              guard: {
                type: 'isStatementPublishable',
              },
            },
            'Back to evaluation': {
              target: 'being_evaluated',
              actions: assign({ state: ASSESSMENT_STATUS_BEING_EVALUATED }),
              guard: {
                type: 'canReturnBackToEvaluation',
              },
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
