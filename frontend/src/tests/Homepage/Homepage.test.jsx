import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../../components/HomePage/HomePage';

// Mock SlideOutMenu to prevent it from rendering
jest.mock('../../components/shared/SlideOutMenu', () => () => <div data-testid="slideout-menu-mock"></div>);

test('renders header, search bar, and feature cards', () => {
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );

  // Check if the header exists
  expect(screen.getByText(/CareLink Home/i)).toBeInTheDocument();

  // Check if the search bar placeholder exists
  expect(screen.getByPlaceholderText(/Find a simple remedy/i)).toBeInTheDocument();

  // Check if the feature cards are displayed
  expect(screen.getByText(/Healthcare near you/i)).toBeInTheDocument();
  expect(screen.getByText(/Chat with a doctor/i)).toBeInTheDocument();
  expect(screen.getByText(/Community forum/i)).toBeInTheDocument();
});
test("hides 'Chat with a doctor' for doctors", () => {
  localStorage.setItem("loggedInUser", JSON.stringify({ role: "doctor" }));

  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );

  expect(screen.queryByText(/Chat with a doctor/i)).toBeNull(); // Should not be visible
  expect(screen.getByText(/Patient requests/i)).toBeInTheDocument(); // Should be visible
});

test("hides 'Patient requests' for patients", () => {
  localStorage.setItem("loggedInUser", JSON.stringify({ role: "patient" }));

  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );

  expect(screen.queryByText(/Patient requests/i)).toBeNull(); // Should not be visible
  expect(screen.getByText(/Chat with a doctor/i)).toBeInTheDocument(); // Should be visible
});

afterEach(() => {
  localStorage.removeItem("loggedInUser"); // Reset local storage after each test
});
