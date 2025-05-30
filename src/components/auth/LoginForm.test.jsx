/*
* Test Scenario for LoginForm component
*
* - should handle email and password typing correctly
* - should call onLogin with correct credentials when form is submitted
* - should show alert when email or password is empty on submission
*/

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './LoginForm'; // Correct path to LoginForm

describe('LoginForm', () => {
  // Mock the onLogin prop function
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    mockOnLogin.mockClear(); // Clear mock calls before each test
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

  it('should handle email and password typing correctly', () => {
    // Scenario: Verify that email and password inputs correctly capture user input
    // Arrange
    render(<LoginForm onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    // Act
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Assert
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('should call onLogin with correct credentials when form is submitted', async () => {
    // Scenario: User submits the form with valid credentials
    // Arrange
    render(<LoginForm onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Act
    fireEvent.click(loginButton);

    // Assert
    expect(mockOnLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should show alert when email or password is empty on submission', async () => {
    // Scenario: User attempts to submit an empty form
    // Arrange
    render(<LoginForm onLogin={mockOnLogin} />);

    const loginButton = screen.getByRole('button', { name: /login/i });

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {}); // Spy on window.alert

    // Act
    fireEvent.click(loginButton);

    // Assert
    expect(alertSpy).toHaveBeenCalledWith('Email dan password harus diisi!');
    expect(mockOnLogin).not.toHaveBeenCalled(); // onLogin should not be called
    alertSpy.mockRestore(); // Restore original alert function
  });
});
