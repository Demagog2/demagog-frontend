import { assign, setup } from 'xstate'

export const autoSaveMachine = setup({
  types: {
    context: {} as {
      saveForm(): void
    },
    input: {} as { saveForm(): void },
    events: {} as
      | { type: 'Enable auto save' }
      | { type: 'Disable auto save' }
      | { type: 'Form field updated' },
  },

  actions: {
    saveForm({ context }) {
      context.saveForm()
    },
  },
}).createMachine({
  context: ({ input }) => ({ saveForm: input.saveForm }),

  id: 'Auto save machine',
  initial: 'enabled',
  states: {
    disabled: {
      on: {
        'Enable auto save': {
          target: 'enabled',
        },
      },
    },
    enabled: {
      initial: 'idle',
      on: {
        'Disable auto save': {
          target: 'disabled',
        },
      },
      states: {
        idle: {
          on: {
            'Form field updated': {
              target: 'pending',
            },
          },
        },
        pending: {
          after: {
            3000: 'saving',
          },
          on: {
            'Form field updated': {
              target: 'pending',
              reenter: true,
            },
          },
        },
        saving: {
          entry: 'saveForm',
          always: {
            target: 'idle',
          },
        },
      },
    },
  },
})
