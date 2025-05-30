/*
* Test Scenario for threadsReducer
*
* - upVoteThreadActionCreator
* - should add userId to upVotesBy and remove from downVotesBy when user upvotes a thread
* - should remove userId from upVotesBy when user upvotes an already upvoted thread (neutralize)
* - downVoteThreadActionCreator
* - should add userId to downVotesBy and remove from upVotesBy when user downvotes a thread
* - should remove userId from downVotesBy when user downvotes an already downvoted thread (neutralize)
*/

import threadsReducer, { upVoteThreadActionCreator, downVoteThreadActionCreator } from './threadsReducer';

describe('threadsReducer', () => {
  const mockInitialState = {
    list: [
      {
        id: 'thread-1',
        title: 'Thread Pertama',
        body: 'Isi thread pertama',
        category: 'General',
        createdAt: '2023-01-01T00:00:00.000Z',
        ownerId: 'user-1',
        upVotesBy: [],
        downVotesBy: [],
        totalComments: 0,
      },
      {
        id: 'thread-2',
        title: 'Thread Kedua',
        body: 'Isi thread kedua',
        category: 'Technology',
        createdAt: '2023-01-02T00:00:00.000Z',
        ownerId: 'user-2',
        upVotesBy: ['user-1'],
        downVotesBy: [],
        totalComments: 0,
      },
    ],
    detail: {
      id: 'thread-1',
      title: 'Thread Pertama',
      body: 'Isi thread pertama',
      category: 'General',
      createdAt: '2023-01-01T00:00:00.000Z',
      owner: { id: 'user-1', name: 'User 1', avatar: '' },
      upVotesBy: [],
      downVotesBy: [],
      comments: [],
      totalComments: 0,
    },
  };

  it('should add userId to upVotesBy and remove from downVotesBy when user upvotes a thread', () => {
    // Scenario: user upvotes a thread
    // Arrange
    const initialState = JSON.parse(JSON.stringify(mockInitialState)); // Deep copy
    const action = upVoteThreadActionCreator({ threadId: 'thread-1', userId: 'user-3' });

    // Act
    const nextState = threadsReducer(initialState, action);

    // Assert
    expect(nextState.list[0].upVotesBy).toEqual(['user-3']);
    expect(nextState.list[0].downVotesBy).toEqual([]);
    expect(nextState.detail.upVotesBy).toEqual(['user-3']);
    expect(nextState.detail.downVotesBy).toEqual([]);
  });

  it('should remove userId from upVotesBy when user upvotes an already upvoted thread (neutralize)', () => {
    // Scenario: user upvotes an already upvoted thread
    // Arrange
    const initialState = JSON.parse(JSON.stringify(mockInitialState)); // Deep copy
    initialState.list[0].upVotesBy = ['user-3'];
    initialState.detail.upVotesBy = ['user-3'];
    const action = upVoteThreadActionCreator({ threadId: 'thread-1', userId: 'user-3' });

    // Act
    const nextState = threadsReducer(initialState, action);

    // Assert
    expect(nextState.list[0].upVotesBy).toEqual([]);
    expect(nextState.detail.upVotesBy).toEqual([]);
  });

  it('should add userId to downVotesBy and remove from upVotesBy when user downvotes a thread', () => {
    // Scenario: user downvotes a thread
    // Arrange
    const initialState = JSON.parse(JSON.stringify(mockInitialState)); // Deep copy
    initialState.list[0].upVotesBy = ['user-3']; // User previously upvoted
    initialState.detail.upVotesBy = ['user-3'];
    const action = downVoteThreadActionCreator({ threadId: 'thread-1', userId: 'user-3' });

    // Act
    const nextState = threadsReducer(initialState, action);

    // Assert
    expect(nextState.list[0].downVotesBy).toEqual(['user-3']);
    expect(nextState.list[0].upVotesBy).toEqual([]);
    expect(nextState.detail.downVotesBy).toEqual(['user-3']);
    expect(nextState.detail.upVotesBy).toEqual([]);
  });

  it('should remove userId from downVotesBy when user downvotes an already downvoted thread (neutralize)', () => {
    // Scenario: user downvotes an already downvoted thread
    // Arrange
    const initialState = JSON.parse(JSON.stringify(mockInitialState)); // Deep copy
    initialState.list[0].downVotesBy = ['user-3'];
    initialState.detail.downVotesBy = ['user-3'];
    const action = downVoteThreadActionCreator({ threadId: 'thread-1', userId: 'user-3' });

    // Act
    const nextState = threadsReducer(initialState, action);

    // Assert
    expect(nextState.list[0].downVotesBy).toEqual([]);
    expect(nextState.detail.downVotesBy).toEqual([]);
  });
});
