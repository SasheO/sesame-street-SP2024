import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../../components/HomePage/HomePage';

test('renders header, search bar, and feature cards', () => {
  render(<HomePage/>);

  // Check if the header exists
  expect(screen.getByText(/CareLink Home/i)).toBeInTheDocument();

  // Check if the search bar placeholder exists
  expect(screen.getByPlaceholderText(/Find a simple remedy/i)).toBeInTheDocument();

  // Check if the feature cards are displayed
  expect(screen.getByText(/Healthcare near you/i)).toBeInTheDocument();
  expect(screen.getByText(/Chat with a doctor/i)).toBeInTheDocument();
  expect(screen.getByText(/Community forum/i)).toBeInTheDocument();
});
