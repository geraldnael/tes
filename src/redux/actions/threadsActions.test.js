/*
* Test Scenario for threadsActions
*
* - asyncUpVoteThread thunk
* - should dispatch upVoteThreadActionCreator and call api.upVoteThread when upvoting is successful
* - should dispatch neutralVoteThreadActionCreator when upvoting fails (rollback)
* - asyncDownVoteThread thunk
* - should dispatch downVoteThreadActionCreator and call api.downVoteThread when downvoting is successful
* - should dispatch neutralVoteThreadActionCreator when downvoting fails (rollback)
*/

import {
  asyncUpVoteThread,
  asyncDownVoteThread,
} from './threadsActions';
import {
  upVoteThreadActionCreator,
  downVoteThreadActionCreator,
  neutralVoteThreadActionCreator,
} from '../reducers/threadsReducer';
import api from '../../api';

// Mocking dependencies
jest.mock('../../api');
// Removed: jest.mock('alert', () => jest.fn()); // Mock alert - This line should be removed

const mockGetState = () => ({
  authUser: {
    authUser: { id: 'user-test' },
  },
  threads: {
    list: [{
      id: 'thread-1',
      upVotesBy: [],
      downVotesBy: [],
    }],
    detail: {
      id: 'thread-1',
      upVotesBy: [],
      downVotesBy: [],
      comments: [],
    },
  },
});

describe('asyncUpVoteThread', () => {
  beforeEach(() => {
    api.upVoteThread.mockReset();
    api.neutralVoteThread.mockReset();
    // Ensure window.alert is mocked for tests that don't explicitly spyOn it
    if (!jest.isMockFunction(window.alert)) {
      jest.spyOn(window, 'alert').mockImplementation(() => {});
    }
  });

  afterEach(() => {
    // Restore alert after tests
    if (jest.isMockFunction(window.alert)) {
      window.alert.mockRestore();
    }
  });

  it('should dispatch upVoteThreadActionCreator and call api.upVoteThread when upvoting is successful', async () => {
    // Scenario: User successfully upvotes a thread
    // Arrange
    const dispatch = jest.fn();
    const getState = mockGetState;
    const threadId = 'thread-1';
    const userId = 'user-test';

    api.upVoteThread.mockResolvedValue(); // Simulate successful API call

    // Act
    await asyncUpVoteThread(threadId)(dispatch, getState);

    // Assert
    expect(dispatch).toHaveBeenCalledWith(upVoteThreadActionCreator({ threadId, userId }));
    expect(api.upVoteThread).toHaveBeenCalledWith(threadId);
    expect(api.neutralVoteThread).not.toHaveBeenCalled(); // Should not call neutralVoteThread on success
  });

  it('should dispatch neutralVoteThreadActionCreator when upvoting fails (rollback)', async () => {
    // Scenario: Upvoting fails, so rollback with neutralVoteThreadActionCreator
    // Arrange
    const dispatch = jest.fn();
    const getState = mockGetState;
    const threadId = 'thread-1';
    const userId = 'user-test';
    const errorMessage = 'Failed to upvote';

    api.upVoteThread.mockRejectedValue(new Error(errorMessage)); // Simulate failed API call

    // Act
    await asyncUpVoteThread(threadId)(dispatch, getState);

    // Assert
    expect(dispatch).toHaveBeenCalledWith(upVoteThreadActionCreator({ threadId, userId })); // Initial optimistic update
    expect(api.upVoteThread).toHaveBeenCalledWith(threadId);
    expect(window.alert).toHaveBeenCalledWith(errorMessage);
    expect(dispatch).toHaveBeenCalledWith(neutralVoteThreadActionCreator({ threadId, userId })); // Rollback
  });

  it('should alert if user is not authenticated', async () => {
    // Scenario: User is not logged in when trying to upvote
    // Arrange
    const dispatch = jest.fn();
    const getState = () => ({ authUser: { authUser: null } }); // Simulate no authenticated user
    const threadId = 'thread-1';

    // Act
    await asyncUpVoteThread(threadId)(dispatch, getState);

    // Assert
    expect(window.alert).toHaveBeenCalledWith('Anda harus login untuk vote!');
    expect(dispatch).not.toHaveBeenCalledWith(upVoteThreadActionCreator(expect.any(Object)));
    expect(api.upVoteThread).not.toHaveBeenCalled();
  });
});

describe('asyncDownVoteThread', () => {
  beforeEach(() => {
    api.downVoteThread.mockReset();
    api.neutralVoteThread.mockReset();
    // Ensure window.alert is mocked for tests that don't explicitly spyOn it
    if (!jest.isMockFunction(window.alert)) {
      jest.spyOn(window, 'alert').mockImplementation(() => {});
    }
  });

  afterEach(() => {
    // Restore alert after tests
    if (jest.isMockFunction(window.alert)) {
      window.alert.mockRestore();
    }
  });

  it('should dispatch downVoteThreadActionCreator and call api.downVoteThread when downvoting is successful', async () => {
    // Scenario: User successfully downvotes a thread
    // Arrange
    const dispatch = jest.fn();
    const getState = mockGetState;
    const threadId = 'thread-1';
    const userId = 'user-test';

    api.downVoteThread.mockResolvedValue(); // Simulate successful API call

    // Act
    await asyncDownVoteThread(threadId)(dispatch, getState);

    // Assert
    expect(dispatch).toHaveBeenCalledWith(downVoteThreadActionCreator({ threadId, userId }));
    expect(api.downVoteThread).toHaveBeenCalledWith(threadId);
    expect(api.neutralVoteThread).not.toHaveBeenCalled(); // Should not call neutralVoteThread on success
  });

  it('should dispatch neutralVoteThreadActionCreator when downvoting fails (rollback)', async () => {
    // Scenario: Downvoting fails, so rollback with neutralVoteThreadActionCreator
    // Arrange
    const dispatch = jest.fn();
    const getState = mockGetState;
    const threadId = 'thread-1';
    const userId = 'user-test';
    const errorMessage = 'Failed to downvote';

    api.downVoteThread.mockRejectedValue(new Error(errorMessage)); // Simulate failed API call

    // Act
    await asyncDownVoteThread(threadId)(dispatch, getState);

    // Assert
    expect(dispatch).toHaveBeenCalledWith(downVoteThreadActionCreator({ threadId, userId })); // Initial optimistic update
    expect(api.downVoteThread).toHaveBeenCalledWith(threadId);
    expect(window.alert).toHaveBeenCalledWith(errorMessage);
    expect(dispatch).toHaveBeenCalledWith(neutralVoteThreadActionCreator({ threadId, userId })); // Rollback
  });

  it('should alert if user is not authenticated', async () => {
    // Scenario: User is not logged in when trying to downvote
    // Arrange
    const dispatch = jest.fn();
    const getState = () => ({ authUser: { authUser: null } }); // Simulate no authenticated user
    const threadId = 'thread-1';

    // Act
    await asyncDownVoteThread(threadId)(dispatch, getState);

    // Assert
    expect(window.alert).toHaveBeenCalledWith('Anda harus login untuk vote!');
    expect(dispatch).not.toHaveBeenCalledWith(downVoteThreadActionCreator(expect.any(Object)));
    expect(api.downVoteThread).not.toHaveBeenCalled();
  });
});
