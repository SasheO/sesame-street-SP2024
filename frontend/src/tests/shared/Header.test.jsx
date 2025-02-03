import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../../components/shared/Header';

test('renders the header with the given title and buttons', () => {
  const testLabel = "CareLink Home";
  render(<Header label={testLabel} />);

  // Check for the title
  expect(screen.getByText(testLabel)).toBeInTheDocument();

  // Check for menu button
  expect(screen.getByRole('button', { name: /☰/i })).toBeInTheDocument();

  // Check for profile icon
  const profileIcon = screen.getByLabelText(/Profile icon/i);
  expect(profileIcon).toBeInTheDocument();
});

test('renders with a different title when provided', () => {
  const testLabel = "Dashboard";
  render(<Header label={testLabel} />);
  
  expect(screen.getByText(testLabel)).toBeInTheDocument();
});
