/*
  * Test Scenario for ThreadCard component
  *
  * - should render thread information correctly
  * - should call onUpVote when upvote button is clicked
  * - should call onDownVote when downvote button is clicked
  */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ThreadCard from './ThreadCard'; // Correct path to ThreadCard

describe('ThreadCard', () => {
  const mockThread = {
    id: 'thread-1',
    title: 'Test Thread',
    body: 'This is a test thread body with some content that might be longer than 150 characters to test truncation. This part should be truncated.',
    category: 'Testing',
    createdAt: '2023-05-20T10:00:00.000Z',
    totalComments: 5,
    owner: {
      id: 'user-1',
      name: 'Test User',
      avatar: 'https://placehold.co/32x32/cccccc/ffffff?text=TU',
    },
    upVotesBy: [],
    downVotesBy: [],
  };

  const mockAuthUser = {
    id: 'user-2',
    name: 'Auth User',
    email: 'auth@example.com',
    avatar: 'https://placehold.co/32x32/cccccc/ffffff?text=AU',
  };

  const mockOnUpVote = jest.fn();
  const mockOnDownVote = jest.fn();
  const mockOnNeutralVote = jest.fn();

  beforeEach(() => {
    mockOnUpVote.mockClear();
    mockOnDownVote.mockClear();
    mockOnNeutralVote.mockClear();
  });

  it('should render thread information correctly', () => {
    // Scenario: Render thread card with given props
    // Arrange
    render(
      <Router>
        <ThreadCard
          {...mockThread}
          authUser={mockAuthUser}
          onUpVote={mockOnUpVote}
          onDownVote={mockOnDownVote}
          onNeutralVote={mockOnNeutralVote}
        />
      </Router>,
    );

    // Assert
    expect(screen.getByText('Test Thread')).toBeInTheDocument();
    expect(screen.getByText('#Testing')).toBeInTheDocument();
    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
    expect(screen.getByText(/5 Komentar/i)).toBeInTheDocument();
    // Check for a part of the truncated body using a regular expression
    expect(screen.getByText(/This is a test thread body with some content that might be longer than 150 characters to test truncation/i)).toBeInTheDocument();
  });

  it('should call onUpVote when upvote button is clicked', () => {
    // Scenario: User clicks upvote button
    // Arrange
    render(
      <Router>
        <ThreadCard
          {...mockThread}
          authUser={mockAuthUser}
          onUpVote={mockOnUpVote}
          onDownVote={mockOnDownVote}
          onNeutralVote={mockOnNeutralVote}
        />
      </Router>,
    );

    const upvoteButton = screen.getByRole('button', { name: /upvote thread/i });

    // Act
    fireEvent.click(upvoteButton);

    // Assert
    expect(mockOnUpVote).toHaveBeenCalledWith(mockThread.id);
    expect(mockOnDownVote).not.toHaveBeenCalled();
    expect(mockOnNeutralVote).not.toHaveBeenCalled();
  });

  it('should call onDownVote when downvote button is clicked', () => {
    // Scenario: User clicks downvote button
    // Arrange
    render(
      <Router>
        <ThreadCard
          {...mockThread}
          authUser={mockAuthUser}
          onUpVote={mockOnUpVote}
          onDownVote={mockOnDownVote}
          onNeutralVote={mockOnNeutralVote}
        />
      </Router>,
    );

    const downvoteButton = screen.getByRole('button', { name: /downvote thread/i });

    // Act
    fireEvent.click(downvoteButton);

    // Assert
    expect(mockOnDownVote).toHaveBeenCalledWith(mockThread.id);
    expect(mockOnUpVote).not.toHaveBeenCalled();
    expect(mockOnNeutralVote).not.toHaveBeenCalled();
  });

  it('should call onNeutralVote when upvote button is clicked and already upvoted', () => {
    // Scenario: User clicks upvote button on an already upvoted thread
    // Arrange
    const threadUpvoted = { ...mockThread, upVotesBy: [mockAuthUser.id] };
    render(
      <Router>
        <ThreadCard
          {...threadUpvoted}
          authUser={mockAuthUser}
          onUpVote={mockOnUpVote}
          onDownVote={mockOnDownVote}
          onNeutralVote={mockOnNeutralVote}
        />
      </Router>,
    );

    const upvoteButton = screen.getByRole('button', { name: /upvote thread/i });

    // Act
    fireEvent.click(upvoteButton);

    // Assert
    expect(mockOnNeutralVote).toHaveBeenCalledWith(mockThread.id);
    expect(mockOnUpVote).not.toHaveBeenCalled();
    expect(mockOnDownVote).not.toHaveBeenCalled();
  });

  it('should call onNeutralVote when downvote button is clicked and already downvoted', () => {
    // Scenario: User clicks downvote button on an already downvoted thread
    // Arrange
    const threadDownvoted = { ...mockThread, downVotesBy: [mockAuthUser.id] };
    render(
      <Router>
        <ThreadCard
          {...threadDownvoted}
          authUser={mockAuthUser}
          onUpVote={mockOnUpVote}
          onDownVote={mockOnDownVote}
          onNeutralVote={mockOnNeutralVote}
        />
      </Router>,
    );

    const downvoteButton = screen.getByRole('button', { name: /downvote thread/i });

    // Act
    fireEvent.click(downvoteButton);

    // Assert
    expect(mockOnNeutralVote).toHaveBeenCalledWith(mockThread.id);
    expect(mockOnUpVote).not.toHaveBeenCalled();
    expect(mockOnDownVote).not.toHaveBeenCalled();
  });
});
