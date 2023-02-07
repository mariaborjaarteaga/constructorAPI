import { initialState, reducer } from '..';

import {
  ACTION_SET_WORKFLOWS,
  ACTION_DELETE_STAGE,
  ACTION_ADD_STAGE,
  ACTION_UPDATE_STAGE,
} from '../../constants';

const WORKFLOWS_FIXTURE = [
  {
    id: 1,
    stages: [
      {
        id: 1,
        name: 'stage-1',
      },

      {
        id: 2,
        name: 'stage-2',
      },
    ],
  },
];

describe('Admin | Settings | Review Workflows | reducer', () => {
  let state;

  beforeEach(() => {
    state = initialState;
  });

  test('should return the initialState', () => {
    expect(reducer(state, {})).toStrictEqual(initialState);
  });

  test('ACTION_SET_WORKFLOWS with workflows', () => {
    const action = {
      type: ACTION_SET_WORKFLOWS,
      payload: { status: 'loading-state', workflows: WORKFLOWS_FIXTURE },
    };

    expect(reducer(state, action)).toStrictEqual(
      expect.objectContaining({
        status: 'loading-state',
        serverState: {
          currentWorkflow: WORKFLOWS_FIXTURE[0],
          workflows: WORKFLOWS_FIXTURE,
        },
        clientState: {
          currentWorkflow: {
            data: WORKFLOWS_FIXTURE[0],
            isDirty: false,
          },
        },
      })
    );
  });

  test('ACTION_SET_WORKFLOWS without workflows', () => {
    const action = {
      type: ACTION_SET_WORKFLOWS,
      payload: { status: 'loading', workflows: null },
    };

    expect(reducer(state, action)).toStrictEqual({
      ...initialState,
      serverState: expect.objectContaining({
        currentWorkflow: null,
      }),
    });
  });

  test('ACTION_DELETE_STAGE', () => {
    const action = {
      type: ACTION_DELETE_STAGE,
      payload: { stageId: 1 },
    };

    state = {
      status: expect.any(String),
      serverState: {
        currentWorkflow: WORKFLOWS_FIXTURE[0],
      },
      clientState: {
        currentWorkflow: { data: WORKFLOWS_FIXTURE[0], isDirty: false },
      },
    };

    expect(reducer(state, action)).toStrictEqual(
      expect.objectContaining({
        clientState: expect.objectContaining({
          currentWorkflow: expect.objectContaining({
            data: expect.objectContaining({
              stages: expect.arrayContaining([WORKFLOWS_FIXTURE[0].stages[1]]),
            }),
          }),
        }),
      })
    );
  });

  test('ACTION_ADD_STAGE', () => {
    const action = {
      type: ACTION_ADD_STAGE,
      payload: { name: 'something' },
    };

    state = {
      status: expect.any(String),
      serverState: expect.any(Object),
      clientState: {
        currentWorkflow: { data: WORKFLOWS_FIXTURE[0], isDirty: false },
      },
    };

    expect(reducer(state, action)).toStrictEqual(
      expect.objectContaining({
        clientState: expect.objectContaining({
          currentWorkflow: expect.objectContaining({
            data: expect.objectContaining({
              stages: expect.arrayContaining([
                {
                  __temp_key__: 3,
                  name: 'something',
                },
              ]),
            }),
          }),
        }),
      })
    );
  });

  test('ACTION_ADD_STAGE when there are not stages yet', () => {
    const action = {
      type: ACTION_ADD_STAGE,
      payload: { name: 'something' },
    };

    state = {
      status: expect.any(String),
      serverState: expect.any(Object),
      clientState: {
        currentWorkflow: { data: null, isDirty: false },
      },
    };

    expect(reducer(state, action)).toStrictEqual(
      expect.objectContaining({
        clientState: expect.objectContaining({
          currentWorkflow: expect.objectContaining({
            data: expect.objectContaining({
              stages: expect.arrayContaining([
                {
                  __temp_key__: 1,
                  name: 'something',
                },
              ]),
            }),
          }),
        }),
      })
    );
  });

  test('ACTION_UPDATE_STAGE', () => {
    const action = {
      type: ACTION_UPDATE_STAGE,
      payload: { stageId: 1, name: 'stage-1-modified' },
    };

    state = {
      status: expect.any(String),
      serverState: expect.any(Object),
      clientState: {
        currentWorkflow: { data: WORKFLOWS_FIXTURE[0], isDirty: false },
      },
    };

    expect(reducer(state, action)).toStrictEqual(
      expect.objectContaining({
        clientState: expect.objectContaining({
          currentWorkflow: expect.objectContaining({
            data: expect.objectContaining({
              stages: expect.arrayContaining([
                {
                  id: 1,
                  name: 'stage-1-modified',
                },
              ]),
            }),
          }),
        }),
      })
    );
  });

  test('properly compare serverState and clientState and set isDirty accordingly', () => {
    const actionAddStage = {
      type: ACTION_ADD_STAGE,
      payload: { name: 'something' },
    };

    state = {
      status: expect.any(String),
      serverState: {
        currentWorkflow: WORKFLOWS_FIXTURE[0],
      },
      clientState: {
        currentWorkflow: { data: WORKFLOWS_FIXTURE[0], isDirty: false },
      },
    };

    state = reducer(state, actionAddStage);

    expect(state).toStrictEqual(
      expect.objectContaining({
        clientState: expect.objectContaining({
          currentWorkflow: expect.objectContaining({
            isDirty: true,
          }),
        }),
      })
    );

    const actionDeleteStage = {
      type: ACTION_DELETE_STAGE,
      payload: { stageId: 3 },
    };

    state = reducer(state, actionDeleteStage);

    expect(state).toStrictEqual(
      expect.objectContaining({
        clientState: expect.objectContaining({
          currentWorkflow: expect.objectContaining({
            isDirty: false,
          }),
        }),
      })
    );
  });
});