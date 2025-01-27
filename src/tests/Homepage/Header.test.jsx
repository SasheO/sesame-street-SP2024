import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../../components/HomePage/HomePage_components/Header';

test('renders the header with the title and buttons', () => {
  render(<Header />);

  // Check for the title
  expect(screen.getByText(/CareLink Home/i)).toBeInTheDocument();

  // Check for menu and profile buttons
  expect(screen.getByText(/☰/i)).toBeInTheDocument();

  const profileIcon = screen.getByLabelText(/Profile icon/i);
      expect(profileIcon).toBeInTheDocument();
});
