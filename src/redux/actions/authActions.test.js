/*
 * Test Scenario for authActions
 *
 * - asyncLoginUser thunk
 * - should dispatch showLoading, setAuthUser, and hideLoading actions when login is successful
 * - should dispatch showLoading and hideLoading actions and alert error message when login fails
 */

import { asyncLoginUser } from './authActions';
import { setAuthUser } from '../reducers/authReducer';
import { showLoading, hideLoading } from '../reducers/loadingBarReducer';
import api from '../../api';
import { putAccessToken } from '../../utils/helpers';

// Mocking dependencies
jest.mock('../../api');
jest.mock('../../utils/helpers', () => ({
  putAccessToken: jest.fn(),
  clearAccessToken: jest.fn(),
}));

describe('asyncLoginUser', () => {
  beforeEach(() => {
    // Reset mocks before each test
    api.login.mockReset();
    api.getOwnProfile.mockReset();
    putAccessToken.mockReset();
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

  it('should dispatch showLoading, setAuthUser, and hideLoading actions when login is successful', async () => {
    // Scenario: Successful login
    // Arrange
    const dispatch = jest.fn();
    const credentials = { email: 'test@example.com', password: 'password123' };
    const mockToken = 'mockToken123';
    const mockAuthUser = { id: 'user-123', name: 'Test User', email: 'test@example.com' };

    api.login.mockResolvedValue(mockToken);
    api.getOwnProfile.mockResolvedValue(mockAuthUser);

    // Act
    await asyncLoginUser(credentials)(dispatch);

    // Assert
    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(api.login).toHaveBeenCalledWith(credentials);
    expect(putAccessToken).toHaveBeenCalledWith(mockToken);
    expect(api.getOwnProfile).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(setAuthUser(mockAuthUser));
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
  });

  it('should dispatch showLoading and hideLoading actions and alert error message when login fails', async () => {
    // Scenario: Failed login
    // Arrange
    const dispatch = jest.fn();
    const credentials = { email: 'test@example.com', password: 'wrongpassword' };
    const errorMessage = 'Invalid credentials';

    api.login.mockRejectedValue(new Error(errorMessage));

    // Act
    await asyncLoginUser(credentials)(dispatch);

    // Assert
    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(api.login).toHaveBeenCalledWith(credentials);
    expect(putAccessToken).not.toHaveBeenCalled(); // Should not call putAccessToken on failure
    expect(api.getOwnProfile).not.toHaveBeenCalled(); // Should not call getOwnProfile on failure
    expect(window.alert).toHaveBeenCalledWith(errorMessage); // Ensure alert is called
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
  });
});
