import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../../components/shared/Header';

test('renders the header with the given title and buttons', () => {
  const testLabel = "CareLink Home";
  render(
    <MemoryRouter>
      <Header label={testLabel} />
    </MemoryRouter>
  );

  // Check for the title
  expect(screen.getByText(testLabel)).toBeInTheDocument();

  // Check for menu button
  const menuIcon = screen.getByLabelText(/Menu/i)
  expect(menuIcon).toBeInTheDocument();

  // Check for profile icon
  const profileIcon = screen.getByLabelText(/Profile icon/i);
  expect(profileIcon).toBeInTheDocument();
});

test('renders with a different title when provided', () => {
  const testLabel = "Dashboard";
  render(
    <MemoryRouter>
      <Header label={testLabel} />
    </MemoryRouter>
  );
  
  expect(screen.getByText(testLabel)).toBeInTheDocument();
});
