/*
* Test Scenario for authReducer
*
* - setAuthUser action creator
* - should return the authUser correctly when given authUser
* - unsetAuthUser action creator
* - should return null when authUser is unset
*/

import authReducer, { setAuthUser, unsetAuthUser } from './authReducer';

describe('authReducer', () => {
  it('should return the authUser correctly when given authUser', () => {
    // Scenario: setAuthUser action creator
    // Arrange
    const initialState = {
      authUser: null,
      isPreload: true,
    };
    const action = setAuthUser({ id: 'user-123', name: 'Test User', email: 'test@example.com' });

    // Act
    const nextState = authReducer(initialState, action);

    // Assert
    expect(nextState.authUser).toEqual({ id: 'user-123', name: 'Test User', email: 'test@example.com' });
  });

  it('should return null when authUser is unset', () => {
    // Scenario: unsetAuthUser action creator
    // Arrange
    const initialState = {
      authUser: { id: 'user-123', name: 'Test User', email: 'test@example.com' },
      isPreload: false,
    };
    const action = unsetAuthUser();

    // Act
    const nextState = authReducer(initialState, action);

    // Assert
    expect(nextState.authUser).toBeNull();
  });
});
