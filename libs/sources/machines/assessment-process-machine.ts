import { setup, assign } from 'xstate'

export const machine = setup({
  types: {
    context: {} as {
      state: string
      isAuthorized(permissions: string[]): boolean
    },
    events: {} as
      | { type: 'Request approval' }
      | { type: 'Back to evaluation' }
      | { type: 'Request proofreading' }
      | { type: 'Approve' },
    input: {} as {
      state: string
      isAuthorized(permissions: string[]): boolean
    },
  },
  actions: {
    updateState: function ({ context, event }, params) {
      // Add your action code here
      // ...
    },
  },
  guards: {
    isAprovalNeeded: function ({ context, event }, params) {
      return context.state === 'approval_needed'
    },
    isProofreadingNeeded: function ({ context, event }, params) {
      return context.state === 'proofreading_needed'
    },
    isApproved: function ({ context, event }, params) {
      return context.state === 'approved'
    },
    canApprove: function ({ context }) {
      return context.isAuthorized(['statements:edit'])
    },
  },
}).createMachine({
  context: ({ input }) => ({
    state: input.state,
    isAuthorized: input.isAuthorized,
  }),
  id: 'Statement evaluation',
  initial: 'Initial',
  states: {
    Initial: {
      always: [
        {
          target: 'Approval needed',
          guard: {
            type: 'isAprovalNeeded',
          },
        },
        {
          target: 'Proofreading needed',
          guard: {
            type: 'isProofreadingNeeded',
          },
        },
        {
          target: 'Approved',
          guard: {
            type: 'isApproved',
          },
        },
        {
          target: 'Being evaluated',
        },
      ],
    },
    'Approval needed': {
      on: {
        'Back to evaluation': {
          target: 'Being evaluated',
          actions: assign({ state: 'being_evaluated' }),
        },
        'Request proofreading': {
          target: 'Proofreading needed',
          actions: assign({ state: 'proofreading_needed' }),
          guard: {
            type: 'canApprove',
          },
        },
      },
    },
    'Proofreading needed': {
      on: {
        Approve: {
          target: 'Approved',
          actions: assign({ state: 'approved' }),
        },
        'Back to evaluation': {
          target: 'Being evaluated',
          actions: assign({ state: 'being_evaluated' }),
        },
      },
    },
    Approved: {
      on: {
        'Back to evaluation': {
          target: 'Being evaluated',
          actions: assign({ state: 'being_evaluated' }),
        },
      },
    },
    'Being evaluated': {
      on: {
        'Request approval': {
          target: 'Approval needed',
          actions: assign({ state: 'approval_needed' }),
        },
      },
    },
  },
})
